import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as supertest from 'supertest';
import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';


describe('BankAccountController', () => {
  let app: INestApplication;
  let controller : BankAccountController


  const mockBankAccount = (
    _id = "some id",
    currency = "EUR",
    ownerId = "some owner id",
    balance = 0,
    name = "New EUR Account"
  ) =>({
    _id,
    ownerId,
    balance,
    currency,
    name
  })

  const mockBankAccountDoc = (mock) => ({
    name: mock?.name || 'New EUR Account',
    currency: mock?.currency || 'EUR',
    _id: mock?.id || 'some id',
    ownerId: mock?.ownerId ||"some owner id",
    balance: mock?.balance || 0,

  });
  
  const BankAccountArray = [
    mockBankAccount("6377a0c7ec5b41b08e8b527d",'USD'),
    mockBankAccount("6377a2fe1c99b5440fe5c9ed"),
    mockBankAccount("6377ac4cfd59cc4418f4bcef"),
  ];
  
  const BankAccountDocumentsArray = [
    mockBankAccountDoc({id:"6377a0c7ec5b41b08e8b527d",currency:'USD'}),
    mockBankAccountDoc({id:"6377a2fe1c99b5440fe5c9ed"}),
    mockBankAccountDoc({id:"6377ac4cfd59cc4418f4bcef"}),
  ];


  const mockBankAccountService = {
    findAll: jest.fn().mockResolvedValue(BankAccountDocumentsArray),
    findOne: jest.fn().mockImplementation((id: string) =>
      Promise.resolve(BankAccountArray.find(e => e._id === id)),
    ),
    findByOwnerId: jest.fn().mockImplementation((ownerId: string) =>
      Promise.resolve(BankAccountArray.filter(e => e.ownerId === ownerId)),
    ),
    create: jest
      .fn()
      .mockImplementation((dto: CreateBankAccountDto) =>
        Promise.resolve({ _id: 'a uuid', ...dto }),
      ),
      update: jest
      .fn()
      .mockImplementation((id:string,dto: UpdateBankAccountDto) =>
        Promise.resolve({ _id: id, ...BankAccountDocumentsArray.find(e=>e._id === id),...dto }),
      ),
    remove: jest.fn().mockImplementation((id: string) =>
    Promise.resolve(BankAccountArray.find(e => e._id === id)),
  )
  }
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankAccountController],
      providers: [
        {
          provide: BankAccountService,
          useValue:mockBankAccountService,
        },
      ],
    }).compile();

    app = module.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    controller = module.get<BankAccountController>(BankAccountController)
    await app.init()
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('GET /bank-account without limit && skip params should return 400',async ()=>{
    return supertest(app.getHttpServer()).get('/bank-account')
    .expect(400) 
  })

  it('GET /bank-account without skip params should return 400',async ()=>{
    return supertest(app.getHttpServer()).get('/bank-account/?limit=3')
    .expect(400) 
  })

  it('GET /bank-account without limit params should return 400',async ()=>{
    return supertest(app.getHttpServer()).get('/bank-account/?skip=3')
    .expect(400) 
  })


  it('GET /bank-account with skip and limit params shoud return 200',async ()=>{
    return supertest(app.getHttpServer()).get('/bank-account/?limit=3&skip=0')
    .expect(200)
  })


  it('GET /bank-account with skip and limit params shoud return Valid Data',async ()=>{
    return supertest(app.getHttpServer()).get('/bank-account/?limit=3&skip=0')
    .expect(200)
    .expect(BankAccountDocumentsArray)
  })

  it('POST /bank-account without currency should return 400',()=>{
    return supertest(app.getHttpServer()).post('/bank-account/')
    .send({})
    .expect(400)
  })

  it('POST /bank-account with incorrect currency should return 400',()=>{
    return supertest(app.getHttpServer()).post('/bank-account/')
    .send({currency: 'GBP'})
    .expect(400)
  })

  it('POST /bank-account with correct currency should return 201',()=>{
    return supertest(app.getHttpServer()).post('/bank-account/')
    .send({currency: 'EUR'})
    .expect(201)
    .expect({_id : "a uuid", currency: 'EUR'})
  })

  it('GET /bank-account/:id with non Existing Id should return 400',()=>{
    return supertest(app.getHttpServer()).get('/bank-account/sdf')
    .expect(404)
  })

  it('GET /bank-account/:id with an Existing Id should return 200',()=>{
    return supertest(app.getHttpServer()).get('/bank-account/6377a0c7ec5b41b08e8b527d')
    .expect(200)
    .expect(BankAccountDocumentsArray.find(e => e._id === '6377a0c7ec5b41b08e8b527d'))
  })

  it('GET /bank-account/owner/:id with a non existing ownerId should return 200 with empty object',()=>{
    return supertest(app.getHttpServer()).get('/bank-account/owner/12')
    .expect(200)
    .expect([])
  })

  
  it('GET /bank-account/owner/:id with an existing ownerId should return 200 with bank account',()=>{
    return supertest(app.getHttpServer()).get('/bank-account/owner/some owner id')
    .expect(200)
    .expect(BankAccountDocumentsArray.filter(e => e.ownerId === "some owner id"))
  })


  it('PATCH /bank-account/:id with a non existing id should return 404',()=>{
    return supertest(app.getHttpServer()).patch('/bank-account/qsd')
    .expect(404)
  })

  it('PATCH /bank-account/:id with an existing id should return 200',()=>{
    const foundBankAccount = BankAccountDocumentsArray.find(e => e._id === "6377a0c7ec5b41b08e8b527d")
    return supertest(app.getHttpServer()).patch('/bank-account/6377a0c7ec5b41b08e8b527d')
    .send({name: "some new name"})
    .expect(200)
    .expect({...foundBankAccount,
    name : "some new name" })
  })

  it('DELETE /bank-account/:id with a non existing id should return 404',()=>{
    return supertest(app.getHttpServer()).delete('/bank-account/qsd')
    .expect(404)
  })


  it('DELETE /bank-account/:id with an existing id should return 404',()=>{
    return supertest(app.getHttpServer()).delete('/bank-account/6377a0c7ec5b41b08e8b527d')
    .expect(200)
    .expect(BankAccountDocumentsArray.find(e => e._id == "6377a0c7ec5b41b08e8b527d"))
  })
});

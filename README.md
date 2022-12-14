# Backend Engineering Assignment MobiLab Solutions GmbH

This repository is created for the Backend engineer position technical assignment at MobiLab Solutions GmbH

## To Note

### Task Progress
You can follow the process of development 'User Stories' in the repository project which is public 

### Branches and versioning
I followed GitFlow practices for managing branches and version. You can take a look at this article which explains everything about GitFlow
https://www.atlassian.com/fr/git/tutorials/comparing-workflows/gitflow-workflow

## Documentation 

Generating the app documentation is easy 
simply run `npx @compodoc/compodoc -p tsconfig.json -s`

## Requirements
    - installed NodeJs  
    - installed npm globally ( comes built-in with Nodejs )

## Getting Started:

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Required dependencies 
    "@nestjs/platform-express": Express Module which is the backbone for a NestJs App,
    "axios": Axios is an Http Client used to Send Http Requests,
    "class-transformer": Transformer Package,
    "class-validator":  Validation Package",
    "mongoose": A node ODM used to interact with MongoDB,
    
### Development dependencies 
    "@compodoc/compodoc": Nest Documentation generator package,
    "@nestjs/cli": nest CLI package to simplify resource( service,controller,module) creation,
    "jest": Javascript Testing library,
    "prettier": Formatter library,
    
### Run Dockerized App
You need first to make sure that the docker engine service is running on your machine to do that you can run :
`sudo systemctl status docker` for linux based systems
if it shows something like 

```○ docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
     Active: inactive (dead)
TriggeredBy: ○ docker.socket
       Docs: https://docs.docker.com
[hedibenfraj@franku sbin]$ 
``` 
you can restart the service using 
`sudo systemctl restart docker` 

once the service is running :
```● docker.service - Docker Application Container Engine
     Loaded: loaded (/usr/lib/systemd/system/docker.service; disabled; vendor preset: disabled)
     Active: active (running) since Tue 2022-11-22 11:48:16 CET; 1s ago
TriggeredBy: ● docker.socket
       Docs: https://docs.docker.com
   Main PID: 54079 (dockerd)
      Tasks: 20
     Memory: 118.2M
        CPU: 550ms
     CGroup: /system.slice/docker.service
             ├─ 54079 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
             └─ 54294 /usr/bin/docker-proxy -proto tcp -host-ip 127.0.0.1 -host-port 3000 -container-ip 172.18.0.2 -container-port 3000

```

run in the project directory
   `sudo docker-compose up`
    
### Available routes

We have two main modules : 
- Bank Account Module
- Transaction Module

#### Bank Account Routes
- getAccounts : GET `/bank-account/?skip=0&limit=3&ASC=desc`
- getAccountById : GET `/bank-account/:id`
- getAccountsByOwnerId : GET `/bank-account/owner/:id`
- createAccount : POST `/bank-account`
- editAccount : PATCH `/bank-account/:id`
- deleteAccount : DELETE `/bank-account/:id`

#### Transaction Routes
- getTransactions : GET `/transaction/?ASC=sda&limit=5&skip=2`
- getTransactionsBetweenDates : GET `/transaction/?startDate=<MongoDB.Date>&endDate=<MongoDB.Date>&ASC=sda&limit=5&skip=2`
- getTransactionsById : GET `/transaction/:id`
- getTransactionsBySenderId : GET `/transaction/sender-account/:id`
- getTransactionsByRecieverId : GET `/transaction/reciever-account/:id`
- createTransaction : POST `/transaction/`
- DeleteTransaction : DELETE `/transaction/:id`

### Folder/File structure 

    __src
     |
     |__ bank-account
     |        |__ dto 
     |        |__ entities
     |        |__ schemas 
     |        |__ back-account.controller.spec.ts
     |        |__ back-account.module.ts
     |        |__ back-account.controller.ts
     |        |__ back-account.service.spec.ts
     |        |__ back-account.service.ts
     |
     |__ config
     |        |__ keys.ts
     |
     |__ conversion
     |        |__ conversion.service.ts
     |         
     |__ exceptions
     |        |__ bank-account.exceptions.ts
     |        |__ global.exceptions.ts
     |        |__ transaction.exceptions.ts
     |        |__ user.exceptions.ts
     |
     |__ filters
     |        |
     |        |__ http-exception.filter.ts
     |
     |__ interceptors
     |        |__ logging.interceptor.ts
     |
     |__ middleware
     |        |__ authentication.middleware.ts
     |        |__ authorization.middleware.ts
     |
     |__ transaction    
     |        |__ dto 
     |        |__ entities
     |        |__ schemas 
     |        |__ transaction.controller.spec.ts
     |        |__ transaction.module.ts
     |        |__ transaction.controller.ts
     |        |__ transaction.service.spec.ts
     |        |__ transaction.service.ts
     |
     |__ request
     |        |__ request.service.ts
     |
     |
     |__ app.controller.spec.ts
     |__ app.controller.spec.ts
     |__ app.module.ts
     |__ app.controller.ts
     |__ app.service.spec.ts
     |__ app.service.ts
     |__ main.ts
     

### Understanding the Folder/File structure

#### 1) bank-account

    -  bank-account 

This folder hold everything related to the bank account module like Data Transfer Objects, the BankAccount Model, BankAccountSchema used for mongoose as well as it's controller, service, module, controller tests and service tests 

#### 2) config
    
    - config  

This directroy exports an object : config that holds :
- DB_URI
- Two keys for acessing the 3rd party currency conversion API

#### 3) conversion

    - conversion 

This folder hold the conversion service where we call the conversion API to convert currencies

#### 4) exceptions 

    - exceptions

This Folder hold custom Exceptions.

#### 5) filters

    - filters

This folder hold filters and specifically the exception filter that is part of the Request flow in Nest JS and is usefull for handeling any thrown exceptions

#### 6) interceptors 

    - interceptors

This folder holds interceptors specifically the logging interceptors. Interceptors are also a part of the Request Flow in Next JS

#### 7) middleware

    - middleware

This directory holds Middlewares specifically the authentication middleware which is a mock middleware that just gets the userId from the global request service which has the request scope so it is initialized for every new request. 


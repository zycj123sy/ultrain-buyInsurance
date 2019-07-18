```
|--build        // built WebAssembly targets
|--contract     // 智能合约
|--migrations   // 部署位置
/*
deploy(contracts_files_path, deploy_account) 第一个参数为合约目标文件的绝对路径，第二个合约部署者账号.
*/
|--templates    // 一些合同模板
|--test         // 测试文件 
|--config.js    // 图形或组合的部件或元件的布置
```



智能合约部分：

通过实现Serializable接口构造三个类，并建立三个数据表用来存储

```
@database(Company, companytable)  
@database(Consumer, consumertable)  
@database(Insurance, insurancetable) 
```

智能合约中实现的功能包括

```go
addCompany(name: account_name,balance: u32,contribution: u32,introduce: string): void//添加公司

addConsumer(name: account_name,sex: string,age: u8): void//添加购买者

addInsurance(id: account_name,name: string,ofCompany: string,price: u32,remaining: u32,money: u32): void//添加保险项

public buyIns(name: account_name,id: account_name,total: u32):void//购买保险
```


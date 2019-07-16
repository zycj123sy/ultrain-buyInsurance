import { Contract } from "ultrain-ts-lib/src/contract";
import { RNAME, NAME } from "ultrain-ts-lib/src/account";
import { Action } from "ultrain-ts-lib/src/action";
import { Log } from "ultrain-ts-lib/src/log";

class Company implements Serializable{
    @primaryid
    name: account_name = 0;//企业名
    balance: u32;//余额
    contribution: u32;//贡献
    introduce: string;//简介

    prints(): void {
        Log.s(this.introduce).s("\nname = ").s(this.name).s("\n");
        Log.s("balance = ").i(this.balance).s(",\ncontribution = ").i(this.contribution);
    }
}
class Consumer implements Serializable{
    @primaryid
    name: account_name = 0;
    sex: string;
    age: u8;
    buyHistory: BuyInsurance[];//购买历史

    primaryKey(): string {  
        return NAME(this.name);  
    }

    prints(): void {
        Log.s("name = ").s(this.name).s("\n");
        Log.s("The history of purchase insurance:\n").s(this.buyHistory);
    }
}
class Insurance implements Serializable{
    @primaryid
    id: u32;//保险编号
    name: string;//保险名
    ofCompany: string;//保险所属公司
    price: u32;//保险价格
    remaining: u32;//剩余数量
    money: u32;//赔保金额
    provision: string;//true是满足赔保条件，false是不予赔保

    prints(): void {
        Log.s("name = ").s(this.name).s(",id = ").i(this.id).s("\n");
        Log.s("price = ").i(this.price).s(",\nremaining = ").i(this.remaining);
    }
}
class BuyInsurance implements Serializable{//购买保险的数据类型，每个对象作为购买历史的一条
    id: u32;
    total: u32;//购买保险份数
    indemnifyOrNot: string;//true是已经赔保，false是尚未赔保
}
const companytable = "company";  
const companyscope = "s.company";

const consumertable = "consumer";  
const consumerscope = "s.consumer";

const insurancetable = "insurance";  
const insurancescope = "s.insurance";

@database(Company, companytable)  
@database(Consumer, consumertable)  
@database(Insurance, insurancetable)  
class InsContract extends Contract {
    companysDB: DBManager<Company>;  
    consumersDB: DBManager<Consumer>;  
    insurancesDB: DBManager<Insurance>;

    constructor(code: u64) {
        super(code);
        this.companysDB = new DBManager<Company>(NAME(companytable), NAME(companyscope));
        this.consumersDB = new DBManager<Consumer>(NAME(consumertable), NAME(consumerscope));
        this.insurancesDB = new DBManager<Insurance>(NAME(insurancetable), NAME(insurancescope));
    }

    @action
    addCompany(company: account_name,balance: u32,contribution: u32,introduce: string): void {
        ultrain_assert(Action.sender == this.receiver, "only contract owner can add companys.");

        let c = new Company();
        c.name = company;
        c.balance=balance;
        c.contribution=contribution;
        c.introduce=introduce;
        let existing = this.companysDB.exists(company);
        if (!existing) {
            this.companysDB.emplace(c);
        } else {
        ultrain_assert(false, "The company already exists.");
        }
    }
    
    @action
    addConsumer(consumer: account_name,sex: string,age: u8): void {
        ultrain_assert(Action.sender == this.receiver, "only contract owner can add consumers.");

        let c = new Consumer();
        c.name = consumer;
        c.sex=sex;
        c.age=age;
        let existing = this.consumersDB.exists(consumer);
        if (!existing) {
            this.consumersDB.emplace(c);
        } else {
        ultrain_assert(false, "The consumer already exists.");
        }
    }
    
    @action
    addInsurance(insurance: u32,name: string,ofCompany: string,price: u32,remaining: u32,money: u32): void {
        ultrain_assert(Action.sender == this.receiver, "only contract owner can add insurances.");

        let c = new Insurance();
        c.id = insurance;
        c.name=name;
        c.ofCompany=ofCompany;
        c.price=price;
        c.remaining=remaining;
        c.money=money;
        c.provision="false";
        let existing = this.insurancesDB.exists(insurance);
        if (!existing) {
            this.insurancesDB.emplace(c);
        } else {
        ultrain_assert(false, "The id of insurance already exists.");
        }
    }
    @action
    public buyIns(consumer: account_name,id: u32,total: u32):void{
        let ins = new Insurance();
        let existing1 = this.consumersDB.exists(consumer);
        let existing2 = this.insurancesDB.exists(id);
        let a = this.insurancesDB.get(id,ins);
        let existing3 = total < ins.remaining;
        if(existing1){
            if(existing2){
                if(existing3){
                    ins.remaining-=total;
                    let newrecord= new BuyInsurance();
                    newrecord.id=id;
                    newrecord.total=total;
                    newrecord.indemnifyOrNot="false";
                    let con = new Consumer();
                    this.consumersDB.get(id,con);
                    con.buyHistory[con.buyHistory.length]=newrecord;
                    this.consumersDB.modify(con);
                    Log.s(RNAME(consumer)).s(" successfully purchased").i(total).s(" insurance.id=").i(id);
                }else{
                    ultrain_assert(false, "The remaining is not enough.");
                }
            }else{
                ultrain_assert(false, "The id does not exist.");
            }
        }else{
            ultrain_assert(false, "User does not exist.");
        }
    }
}
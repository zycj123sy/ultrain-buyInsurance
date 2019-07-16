const { createU3, U3Utils } = require("u3.js");
const config = require("../config");

const chai = require("chai");
require("chai")
  .use(require("chai-as-promised"))
  .should();

describe("Tests", function() {

  let creator = "ben";

  it("companys", async () => {//创建三个公司
    const u3 = createU3(config);

    await u3.transaction(creator, c => {
      c.addCompany("TaiPingyang",10000000,10,"xxxx", { authorization: [`ben@active`] });
      c.addCompany("RenShou", 2000000,5,"yyyy",{ authorization: [`ben@active`] });
      c.addCompany("PingAn", 3000000,10,"zzzz",{ authorization: [`ben@active`] });
    });

    U3Utils.test.wait(3000);

    const companytable = "company";
    const companyscope = "s.company";
    let companys = await u3.getTableRecords({
      "json": true,
      "code": creator,
      "scope": companyscope,
      "table": companytable
    });
    companys.rows.length.should.equal(3);
  });

  it("consumers", async () => {//创建三个投保人
    const u3 = createU3(config);

    await u3.transaction(creator, c => {
      c.addConsumer("FEI","man",30, { authorization: [`ben@active`] });
      c.addConsumer("ZHAI", "man",45,{ authorization: [`ben@active`] });
      c.addConsumer("LANG", "man",40,{ authorization: [`ben@active`] });
    });

    U3Utils.test.wait(3000);

    const consumertable = "consumer";
    const consumerscope = "s.consumer";
    let consumers = await u3.getTableRecords({
      "json": true,
      "code": creator,
      "scope": consumerscope,
      "table": consumertable
    });
    consumers.rows.length.should.equal(3);
  });

it("insurances", async () => {//创建三个保险
    const u3 = createU3(config);

    await u3.transaction(creator, c => {
      c.addInsurance("666","work injury insurance","TaiPingyang",100,100,1000, { authorization: [`ben@active`] });
      c.addInsurance("996","ddl insurance","RenShou", 100,100,1000,{ authorization: [`ben@active`] });
      c.addInsurance("101","medical insurance","PingAn", 100,100,1000,{ authorization: [`ben@active`] });
    });

    U3Utils.test.wait(3000);

    const insurancetable = "insurance";
    const insurancescope = "s.insurance";
    let insurances = await u3.getTableRecords({
      "json": true,
      "code": creator,
      "scope": insurancescope,
      "table": insurancetable
    });
    insurances.rows.length.should.equal(3);
  });

  it("ZHAI-buy-ddl insurance", async () => {
    config.keyProvider = "5JC2uWa7Pba5V8Qmn1pQPWKDPgwmRSYeZzAxK48jje6GP5iMqmM";
    const u3 = createU3(config);

    const buyingtable = "buys";
    const buyingscope = "s.buys";
    await u3.getTableRecords({
      "json": true,
      "code": creator,
      "scope": buyingscope,
      "table": buyingtable
    });

    let contract = await u3.contract(creator);
    await contract.buyIns("ZHAI","996",6, { authorization: [`ZHAI@active`] });

    U3Utils.test.wait(3000);

    await u3.getTableRecords({
      "json": true,
      "code": creator,
      "scope": buyingscope,
      "table": buyingtable
    });
  });


});

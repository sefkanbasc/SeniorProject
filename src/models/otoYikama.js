const sql = require('mssql');

const config = {
  user: "sa",
  password:  "A+1197!",
  database: "ConceptCar",
  server: "185.131.49.118",
  port: 19955,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
};

// model for consumer
const Consumer = {
  create: async function(data) {
    try {
      const pool = await sql.connect(config);
      const request = pool.request();
      let query;
      switch(data.Table) {
        case "OtoYikama":
          query = `
          INSERT INTO OtoYikama (Name, CreatedDate, il, ilce, adres, dukkansahibi,Latitude,Longitude, location, dukkanContent, orderHistory, PhoneNumber, Email, Password,isOpen)
          VALUES (@Name, @CreatedDate, @il, @ilce, @adres, @dukkansahibi,@Latitude,@Longitude, @location, @dukkanContent, @orderHistory, @PhoneNumber, @Email, @Password,@isOpen);
          `;
          break;
        case "LastikOteli":
          query = `
          INSERT INTO LastikOteli (Name, CreatedDate, il, ilce, adres, dukkansahibi,Latitude,Longitude, location, dukkanContent, orderHistory, PhoneNumber, Email, Password,isOpen)
          VALUES (@Name, @CreatedDate, @il, @ilce, @adres, @dukkansahibi,@Latitude,@Longitude, @location, @dukkanContent, @orderHistory, @PhoneNumber, @Email, @Password,@isOpen);
          `;
          break;
        case "OtoBakimVeTamir":
          query = `
          INSERT INTO OtoBakimVeTamir (Name, CreatedDate, il, ilce, adres, dukkansahibi,Latitude,Longitude, location, dukkanContent, orderHistory, PhoneNumber, Email, Password,isOpen)
          VALUES (@Name, @CreatedDate, @il, @ilce, @adres, @dukkansahibi,@Latitude,@Longitude, @location, @dukkanContent, @orderHistory, @PhoneNumber, @Email, @Password,@isOpen);
          `;
          break;
      }
      request.input('Name', sql.NVarChar(50), data.Name);
      request.input('CreatedDate', sql.NVarChar(100), data.CreatedDate);
      request.input('il', sql.NVarChar(100), data.il);
      request.input('ilce', sql.NVarChar(50), data.ilce);
      request.input('adres', sql.NVarChar(100), data.adres);
      request.input('dukkansahibi', sql.NVarChar(100), data.dukkansahibi);
      request.input('Latitude', sql.Float, data.Latitude);
      request.input('Longitude', sql.Float, data.Longitude);
      request.input('location', sql.NVarChar(100), `POINT(${data.Longitude} ${data.Latitude})`);
      request.input('dukkanContent', sql.NVarChar(500), JSON.stringify(data.dukkanContent));
      request.input('orderHistory', sql.NVarChar(500), JSON.stringify(data.orderHistory));
      request.input('PhoneNumber', sql.NVarChar(100), data.PhoneNumber);
      request.input('Email', sql.NVarChar(100), data.Email);
      request.input('Password', sql.NVarChar(100), data.Password);
      request.input('isOpen', sql.Bit, false);
      const result = await request.query(query);

      return result.recordset;
    } catch (err) {
      console.log(err);
    }
  }
};


module.exports = { Consumer };

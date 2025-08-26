const sql = require("mssql");
const { DefaultAzureCredential } = require("@azure/identity");
const accessToken = require("ms-rest-nodeauth");

async function getToken() {
  const credential = new DefaultAzureCredential();
  const token = await credential.getToken("https://database.windows.net/");
  return token.token;
}

async function connectDb() {
  const token = await getToken();
  const pool = await sql.connect({
    server: "backendserver234.database.windows.net",
    database: "Thakur",
    options: { encrypt: true },
    authentication: {
      type: "azure-active-directory-access-token",
      options: { token: token }
    }
  });

  const result = await pool.request().query("SELECT GETDATE() AS currentTime");
  console.log(result.recordset);
}

connectDb().catch(err => console.error("DB Error:", err));

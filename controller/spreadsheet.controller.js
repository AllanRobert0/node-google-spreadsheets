const { GoogleSpreadsheet } = require("google-spreadsheet");

const credentials = require("../keys/credentials");

const docID = process.env.DOC_ID;

async function loadRows(req, res) {
  try {
    const doc = new GoogleSpreadsheet(docID);

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];

    const rows = await sheet.getRows();

    const itens = [];

    rows.forEach((row, index) => {
      itens[index] = {
        product_id: `${row.product_id}`,
        name: `${row.name}`,
        qtd_remaing: `${row.qtd_remaing}`,
        price: `${row.price}`,
        message: `${row.message}`,
        pictures: `${row.pictures ? row.pictures : []}`,
      };
    });

    res.status(200).json({ rows: itens });
  } catch (error) {
    res.status(400).send({ error });
  }
}

async function addRow(req, res) {
  try {
    const doc = new GoogleSpreadsheet(docID);

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // the first sheet
    //todo: _validate(req.body)
    const product_id = generateProductId();

    await sheet.addRow({
      product_id,
      ...req.body,
    });

    res.status(200).json({ status: "Sucessfully added" });
  } catch (error) {
    res.status(400).send({ error });
  }
}

async function deleteRow(req, res) {
  try {
    const doc = new GoogleSpreadsheet(docID);

    await doc.useServiceAccountAuth(credentials);

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // the first sheet

    const rows = await sheet.getRows();

    const paramProductId = req.params.id;

    let rowToDelete = null;

    // with async, the function can't breaks
    rows.every((row) => {
      let breakFunction = false;

      if (row.product_id == paramProductId) {
        rowToDelete = row;

        breakFunction = true;
      }
      if (breakFunction) return false;
      else return true;
    });

    await rowToDelete.del();

    res.status(200).json({ status: "Sucessfully Deleted" });
  } catch (error) {
    res.status(400).send({ error });
  }
}

function generateProductId() {
  return JSON.stringify(new Date()).replace(/[^\w\s]/gi, "");
}

module.exports = {
  loadRows,
  addRow,
  deleteRow,
};

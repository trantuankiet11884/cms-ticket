import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data: any, filename: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.values = [
    "STT",
    "Booking Code",
    "Số vé",
    "Tình trạng sử dụng",
    "Ngày sử dụng",
    "Ngày xuất vé",
    "Cổng check-in",
    "Tên sự kiện",
  ];

  worksheet.getColumn("A").width = 10;
  worksheet.getColumn("B").width = 15;
  worksheet.getColumn("C").width = 10;
  worksheet.getColumn("D").width = 15;
  worksheet.getColumn("E").width = 15;
  worksheet.getColumn("F").width = 15;
  worksheet.getColumn("G").width = 15;

  for (let i = 0; i < data.length; i++) {
    const rowData = data[i];
    const row = worksheet.getRow(i + 2);

    row.getCell(1).value = rowData.key;
    row.getCell(2).value = rowData.bookingCode;
    row.getCell(3).value = rowData.numberTicket;
    row.getCell(4).value = rowData.status;
    row.getCell(5).value = rowData.dou;
    row.getCell(6).value = rowData.trd;
    row.getCell(7).value = rowData.gate;
    row.getCell(8).value = rowData.nameEvent;
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "EFEFEF" },
      };
    }
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};

export const exporCptToExcel = async (data: any, filename: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.values = [
    "STT",
    "Số vé",
    "Ngày sử dụng",
    "Tên loại vé",
    "Cổng check-in",
    " ",
  ];

  worksheet.getColumn("A").width = 10;
  worksheet.getColumn("B").width = 15;
  worksheet.getColumn("C").width = 10;
  worksheet.getColumn("D").width = 15;
  worksheet.getColumn("E").width = 15;
  worksheet.getColumn("F").width = 15;
  worksheet.getColumn("G").width = 15;

  for (let i = 0; i < data.length; i++) {
    const rowData = data[i];
    const row = worksheet.getRow(i + 2);

    row.getCell(1).value = rowData.key;
    row.getCell(2).value = rowData.codeTicket;
    row.getCell(5).value = rowData.dou;
    row.getCell(3).value = rowData.name;
    row.getCell(4).value = rowData.gate;
    row.getCell(6).value = rowData.isComparision;
  }

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber % 2 === 0) {
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "EFEFEF" },
      };
    }
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${filename}.xlsx`);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};

const xlsx = require("xlsx");

// Build the workbook in memory and send it - no shared files on disk,
// so concurrent exports can never mix up users' data
const sendExcel = (res, rows, sheetName, fileName) => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(rows);
    xlsx.utils.book_append_sheet(wb, ws, sheetName);
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(buffer);
};

module.exports = { sendExcel };

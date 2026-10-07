// CLIENT_URL holds the frontend origin(s), comma-separated, e.g.
// "https://expense-tracker-frontend-74jc.onrender.com,http://localhost:5173".
// The first entry is used to build links in emails.
const getAllowedOrigins = () =>
    (process.env.CLIENT_URL || "")
        .split(",")
        .map((url) => url.trim().replace(/\/+$/, ""))
        .filter(Boolean);

const getClientUrl = () => {
    const [clientUrl] = getAllowedOrigins();
    if (!clientUrl) {
        throw new Error("CLIENT_URL is not configured");
    }
    return clientUrl;
};

module.exports = { getAllowedOrigins, getClientUrl };

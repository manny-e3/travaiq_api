export function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.TRAVAIQ_MICROSERVICE_KEY;

    if (!validKey) {
        console.warn('WARNING: TRAVAIQ_MICROSERVICE_KEY is not set in the environment. Blocking all protected routes.');
        return res.status(500).json({ error: 'Server misconfiguration: missing API key' });
    }

    if (!apiKey || apiKey !== validKey) {
        console.warn(`Unauthorized access attempt to ${req.originalUrl} from ${req.ip}`);
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API Key' });
    }

    next();
}

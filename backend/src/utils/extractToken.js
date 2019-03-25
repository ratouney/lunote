function extractToken(request) {
    return request.headers['authorization'] || request.headers['Authorization'];
}

export default extractToken;
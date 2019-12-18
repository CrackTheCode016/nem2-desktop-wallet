import * as utils from '@/core/utils/utils.ts'

describe('httpToWs', () => {
    it('should handle http', () => {
        const wsEndpoint = utils.httpToWs('http://endpoint.com:3000')
        expect(wsEndpoint).toBe('ws://endpoint.com:3000')
    });

    it('should handle https', () => {
        const wsEndpoint = utils.httpToWs('https://endpoint.com:3000')
        expect(wsEndpoint).toBe('wss://endpoint.com:3000')
    });
});

describe('completeUrlWithHostAndProtocol', () => {
    const fullUrl = 'http://endpoint.com:3000'
    it('should return origin url if the url contains both port and protocol ', () => {
        const result = utils.completeUrlWithHostAndProtocol(fullUrl)
        expect(result).toBe(fullUrl)
    });
    it('should return full url while the url does not contain port', () => {
        const url = 'http://endpoint.com'
        const result = utils.completeUrlWithHostAndProtocol(url)
        expect(result).toBe(fullUrl)
    });
    it('should return full url while the url does not contain protocol', () => {
        const url = 'endpoint.com:3000'
        const result = utils.completeUrlWithHostAndProtocol(url)
        expect(result).toBe(fullUrl)
    });
    it('should return full url while the url does not contain protocol or port', () => {
        const url = 'endpoint.com'
        const result = utils.completeUrlWithHostAndProtocol(url)
        expect(result).toBe(fullUrl)
    });
});

const { describe, it, expect } = require('vitest');

describe('主功能测试', () => {
    it('测试功能A', () => {
        expect(1 + 1).toBe(2);
    });

    it('测试功能B', () => {
        expect('hello'.toUpperCase()).toBe('HELLO');
    });
});
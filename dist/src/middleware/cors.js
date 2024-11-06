"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const options = {
    origin: ['*'],
    methods: ['POST', 'OPTIONS', 'GET', 'PUT', 'DELETE'],
    allowedHeaders: ['*'],
    exposedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-TOKEN', 'X-Requested-With', 'X-CLIENT-IDENTIFIER', 'X-CLIENT-VERSION'],
    credentials: true,
};
exports.default = options;

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import pino from 'pino';
import fs from 'node:fs';

const logFilePath = './app.log';
const logger = pino(
    pino.destination({
        dest: logFilePath, // Log file path
        sync: true,        // Ensure synchronous writes
    })
);

const server = new McpServer({
    name: "My Weather Service",
    version: "1.0.0",
});

// https://www.weatherapi.com/api-explorer.aspx
const WEATHER_API_KEY="4727f4b8aece4674ba6154943251503";
/*server.tool(
    "get-weather1",
    "Get weather for city",
    {
        // city: z.string().length(100).describe("City name"),
        city: z.string().describe("City name"),
    },
    async ({ state: city }) => {
        const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${ city }&aqi=no`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();
        console.log( data );

        // fs.writeFileSync('C:\\Users\\4artu\\IdeaProjects\\modelcontextprotocol\\log.log', city);
        fs.writeFileSync('C:/Users/4artu/IdeaProjects/modelcontextprotocol/log.log', city);

        return {
            content: [
                {
                    type: "text",
                    "text": "Hello !"
                    // text: `Weather in ${data?.location?.country} in ${data?.location?.name} is currently ${data?.current?.condition?.text} with a temperature of ${data?.current?.temp_c}°C or ${data?.current?.temp_f}°F.`
                },
            ],
        };
    }
);*/

server.tool(
    "get-weather",
    "Get weather for City",
    {
        city: z.string().describe("City name"),
    },
    async ({ city }) => {

        fs.writeFileSync('./log.log', city);

        const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${ city }&aqi=no`;
        console.log(url);

        const response = await fetch(url);
        const data = await response.json();
        console.log( data );

        // fs.writeFileSync('C:\\Users\\4artu\\IdeaProjects\\modelcontextprotocol\\log.log', city);


        return {
            content: [
                {
                    type: "text",
                    text: `Weather in ${data?.location?.country} in ${data?.location?.name} is currently ${data?.current?.condition?.text} with a temperature of ${data?.current?.temp_c}°C or ${data?.current?.temp_f}°F.`
                },
            ],
        };
    },
);


const transport = new StdioServerTransport();
await server.connect(transport);
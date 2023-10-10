# Server-Sent Events (SSE) Example

This Node.js application demonstrates Server-Sent Events (SSE) to enable real-time communication between clients and a server. SSE is a powerful technology for building real-time web applications such as live chats, real-time dashboards, and instant notifications.

## Features

### Example 1: Live Text File Updates

In this example, the application monitors changes to a text file, "text.txt," and sends its content to connected clients whenever it updates. Clients access a web page that establishes an SSE connection to receive live updates from the server.

### Example 2: Broadcasting Real-Time Facts

This example showcases broadcasting real-time facts to connected clients. Clients can connect to "/events" to receive facts as they are posted to the server. The server maintains a list of connected clients and broadcasts newly added facts to all of them. Clients can also post new facts to be shared with others.

## Usage

1. Clone this repository:

   ```bash
   git clone https://github.com/AnasQiblawi/Server-Sent-Events-SSE.git
   cd server-sent-events-sse
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Access the examples:

   - Example 1 (Live Text File Updates): Open a web browser and navigate to `http://localhost/`.
   - Example 2 (Broadcasting Real-Time Facts): Connect to `http://localhost/events` to receive and post real-time facts.

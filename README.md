
# Telegram Bot for Order Management

This Telegram bot helps users create, manage, and respond to orders within a group. Designed with simplicity and efficiency in mind, it provides streamlined communication between customers and responders.

---

## Features and Workflow

### How to Use the Bot

1. **Start the Bot:**
   - After clicking `/start`, the bot sends a welcome message.
   - A button **"створити замовлення"** (Create Order) appears.

2. **Creating an Order:**
   - The bot asks questions based on a predefined set of fields (as per a question table).
   - At the end, the bot generates an order.
   - Before publishing, the user can review the order details.
   - Pressing the **"опублікувати"** (Publish) button posts the order in the group.

3. **Order in the Group:**
   - The order appears in the group with a **"відгукнутися"** (Respond) button.
   - When clicked:
     - The responder receives a message: *"Ваш відгук відправлено замовнику"* (Your response has been sent to the customer).
     - The customer receives: *"На ваше замовлення відгукнулися"* (Someone has responded to your order), along with the nickname of the responder.

4. **Managing Responses:**
   - The customer has two options: **Accept** or **Reject** the response.
     - **Accepting**:
       - The group message is updated: The **"відгукнутися"** button is removed, and *"замовлення закрито"* (Order closed) is appended.
       - The customer receives: *"Відгук користувача @nickname підтверджено. Замовлення закрито."* (The response from @nickname is confirmed. Order closed).
     - **Rejecting**:
       - No changes are made to the group message.
       - The customer receives: *"Відгук користувача @nickname відхилено."* (The response from @nickname is rejected).

---

### Activating the Bot in a Group

- The bot works with only **one group** at a time.
- When added to a group, the bot remembers the group ID and starts working immediately.
- To add the bot to a new group:
  1. Remove the bot from the current group.
  2. The bot clears the ID of the previous group and is ready to "remember" the new group's ID.
- Users must be subscribed to the bot (press `/start`) to receive messages from it.

---

## Technical Details

- **Built with:** Node.js
- **Deployed on:** Railway
- **Temporary Data Storage:** Upstash

---

## Additional Services

Upon completion of an order, I will provide:
- The bot's source code.
- Integration with your Telegram account for easy bot management.

---

## Deployment

### Prerequisites
- A Telegram bot token (from [BotFather](https://core.telegram.org/bots)).
- An Upstash account for Redis storage.
- A Railway account for deployment.

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/telegram-bot-project.git
   cd telegram-bot-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with:
   ```env
   TELEGRAM_BOT_TOKEN=your_bot_token
   REDIS_URL=your_upstash_url
   ```

4. Deploy to Railway:
   - Push the repository to Railway and link your project.
   - Add environment variables to the Railway dashboard.
   - Start the service.

---

## Support

If you encounter any issues or need assistance, feel free to reach out!

# Kraken

**In order to [use the API](https://support.kraken.com/hc/en-us/articles/360022634132-Using-the-API), you need to generate a pair of unique API keys:**

1. [Login to your Kraken Futures.](https://www.kraken.com/login-futures)

2. Click on your profile (email address) on the upper-right corner.

3. Select "Settings" from the drop-down menu.

4. Select the "Create Key" tab in the API panel.

5. There are two options when generating API keys with differing levels of access:

General API:

•	No Access: This key does not allow any access to any endpoints. (This option could be selected if you only wanted a key with access to withdraw digital assets.)

•	Read Only: This is a read-only key and allows accessing only endpoints that do not write to the server.

•	Full Access: This is a master key and allows accessing all endpoints, excluding digital asset withdrawals.
Withdrawal API:

•	No Access: This key is does not allow access to digital asset withdrawals.

•	Full Access: This key allows access to digital asset withdrawals.

6. Press the "Create Key" button.

7. View your Public and Private keys and record them somewhere safe.

**Your api_key (Public key):**

***Example : rRra59qKQs3y1egAgSaG0RJlBcbq97wTUXSxXxPdhRZdv7z9ijZRWgrf***

**Your api_secret (Private key):**

***Example: rttp4AzwRfYEdQ7R7X8Z/04Y4TZPa97pqCypi3xXxAqftygftnI6H9yGV+OcUOOJeFtZkr8mVwbAndU3Kz4Q+eG***

The private key is shown only once! You cannot go back and view it again later.
API keys should be kept in a safe location and should never be shared with anyone.
If you are not absolutely certain that you can store your API private key in a safe place, do not generate it.
Up to 50 keys can be created with distinct nonces.

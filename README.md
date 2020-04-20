# Experience 2020 - Sample Global Custom Tool
This repo provides the code used to demonstrate the Global Custom Tool feature during the **Personalizing the LO Experience** session at the Ellie Mae Virtual Experience 2020. The tool demonstrates how to create a global Loan Search capability within LO Connect/Encompass Web.

To use the tool, you will need to place the HTML, CSS, JS and JPG files onto a publicly accessible web server. You will then set up the tool within the LO Connect Admin Portal, under the `Customizations > Custom Tools` section.

For the tool to function properly, it requires that you are running a **Token Exchange** service thru which the tool can obtain an API token to call into the Encompass REST APIs. The Token Exchange service used during the demo can be found a separate repo named [exp20-token-exchange](https://github.com/elliemae/exp20-token-exchange).

The script currently assumes the Token Exchange service is running on `localhost` on port 8081. If you choose to run the service elsewhere, you will need to update the endpoint within the script to point to the appropriate location.

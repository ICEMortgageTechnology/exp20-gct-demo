
window.addEventListener('load', onLoad);

// The Encompass API host name
const apiHost = 'api.elliemae.com';

// The access token used for API calls
var accessToken = null;

// Loads the form's contents
async function onLoad() {

    accessToken = sessionStorage.getItem("EMAccessToken");

    if (!accessToken) {
        accessToken = await generateAccessToken();
        sessionStorage.setItem("EMAccessToken", accessToken);
    }

    // Provide the quick search bar
    showQuickSearch();
}

// Generates an access token using Token Exchange
async function generateAccessToken() {

    const http = await elli.script.getObject('http');
    const auth = await elli.script.getObject('auth');

    // Generate an auth code from the host application
    let authCode = await auth.createAuthCode();

    // Invoke the token excahnge API
    let tokenResp = await http.post('http://localhost:8081/api/token', 
        { "Content-Type": "application/json" }, 
        { authCode: authCode }
    );

    if (tokenResp.status != 200) {
        showError('Could not create access token')
        return;
    }

    // Extract the access token from the API response
    return tokenResp.body.token_type + ' ' + tokenResp.body.access_token;
}

// Perform a search
async function performSearch(searchVal) {
    // Invoke the Loan Pipeline API
    const searchRequest = {
        fields: [ "Loan.BorrowerName", "Loan.LoanNumber", "Loan.Address1", "Loan.City", "Loan.State", "Loan.Zip" ],
        filter: {
            operator: 'or',
            terms: [
                { canonicalName: 'Loan.LoanNumber', value: searchVal, matchType: 'contains' },
                { canonicalName: 'Loan.BorrowerLastName', value: searchVal, matchType: 'contains' },
                { canonicalName: 'Loan.Address1', value: searchVal, matchType: 'contains' }
            ]
        }
    };

    // Perform the search
    const http = await elli.script.getObject('http');
    let pipeline = await http.post(
        `https://${apiHost}/encompass/v1/loanPipeline?limit=10`,
        accessToken,
        searchRequest
    );

    // Render the results
    clearSearchResults();

    pipeline.body.forEach(element => {
        appendToResults(element);
    });

    if (!pipeline.body.length) {
        displayNoMatchResult();
    }
}

// Opens a loan
async function openLoan(guid) {
    let app = await elli.script.getObject("application");
    app.navigate({
        target: 'Borrower Summary Origination',
        type: 'STANDARD_FORM',
        context : {
            loanId: guid
        }
    });
}

// Clears the pipeline
function displayNoMatchResult() {
    let results = document.getElementById('results');
    results.innerHTML = '<span class="nomatch">No matches were found for your search</span>'; 
}

// Clears the pipeline
function clearSearchResults() {
    let results = document.getElementById('results');
    results.innerHTML = ''; 
}

// Appends a record to the results list
function appendToResults(element) {
    let results = document.getElementById('results');
    let item = document.createElement('div');
    item.className = 'searchresult';
    item.innerHTML = `<a href="javascript: 
        openLoan('${element.loanGuid}');">${element.fields['Loan.BorrowerName']}</a>
        (${element.fields['Loan.LoanNumber']}), 
        <span class="addr">${element.fields['Loan.Address1']}, ${element.fields['Loan.City']},
        ${element.fields['Loan.State']} ${element.fields['Loan.Zip']}</span>
    ` 
    results.appendChild(item);
}

// Show the QuickSearch bar
function showQuickSearch() {
    setVisible('qs', true);
    setVisible('err', false);
}

// Show the Error screen
function showError(message) {
    let errBox = document.getElementById('err');
    errBox.innerText = message;

    setVisible('qs', false);
    setVisible('err', true);
}

// Shows or hides an module section
function setVisible(id, visible) {
    document.getElementById(id).style.display = visible ? 'block' : 'none';
}
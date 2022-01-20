const VTEX_ACCOUNT = 'bacardimartini';
const VTEX_ORDER_ID = '44f36c1e3c5f4c09ae43a96bd3d9c218';

const VTEX_REST_API_URL = `https://${VTEX_ACCOUNT}.vtexcommercestable.com.br/api`;
const VTEX_AUTHENTICATION_URL = `https://${VTEX_ACCOUNT}.myvtex.com/api/vtexid/pub/authentication`;

const VTEX_DEBUG_SECTION_CSS_CLASS = 'debug-section';
const VTEX_ADDTOCART_BUTTON_CSS_CLASS = 'add-to-cart';

document.addEventListener('DOMContentLoaded', vtexMain, false);

class VtexLogger {
  constructor(debugDetails) {
    this.debugDetails = debugDetails;
  }
  debug(str) {
    if (this.debugDetails) {
      this.debugDetails.appendChild(document.createTextNode(`${str}\n`));
    } else {
      console.log(str);
    }
  } 
}

async function vtexMain() {
  // Debug section / Logger
  const debugSection = document.querySelector(`.${VTEX_DEBUG_SECTION_CSS_CLASS}`);
  let debugDetails;
  if (debugSection) {
    debugDetails = document.createElement('details');
    debugDetails.style['white-space'] = 'pre';
    const debugSummary = document.createElement('summary');
    debugSummary.appendChild(document.createTextNode('Debug panel'))
    debugDetails.appendChild(debugSummary);
    debugDetails.appendChild(document.createTextNode('Starting to fetch order form\n'));
    debugSection.appendChild(debugDetails);
  }
  const logger = new VtexLogger(debugDetails);
  getVtexOrderForm(VTEX_ORDER_ID)
    .then((orderForm) => {
      logger.debug(`Order form retrieve successfully. ID: ${orderForm.orderFormId}`);
    })
    .catch((error) => logger.debug(`Error from VTEX: ${error}`));
  

  // Add to cart button
  const addToCartButton = document.querySelector(`.${VTEX_ADDTOCART_BUTTON_CSS_CLASS}`);
  if (addToCartButton) {
    addToCartButton.addEventListener('click', addProductToVtexCart);
  } else {
    logger.debug(`Button with class ${VTEX_ADDTOCART_BUTTON_CSS_CLASS} not found`);
  }
}

async function vtexAuthenticate() {
  await fetch(`${VTEX_AUTHENTICATION_URL}/providers?scope=&accountName=${VTEX_ACCOUNT}`, {
    'credentials': 'include',
    'headers': {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
      'Accept': '*/*',
      'Accept-Language': 'en,fr;q=0.8,fr-FR;q=0.5,en-US;q=0.3',
      'vtex-id-ui-version': 'vtex.admin-login@1.22.1/vtex.react-vtexid@4.47.0',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin'
    },
    'referrer': `https://${VTEX_ACCOUNT}.myvtex.com/_v/segment/admin-login/v1/login?returnUrl=%2F%3F`,
    'method': 'GET',
    'mode': 'cors'
  });
}

async function getVtexOrderForm(orderId) {
  const orderFormResponse = await fetch(`${VTEX_REST_API_URL}/checkout/pub/orderForm/${orderId}`, buildVtexGetRequestOptions());
  const orderForm = orderFormResponse.json();
  if (orderFormResponse.ok) {
    return orderForm;
  } else {
    throw new Error(orderForm);
  }
}

async function addProductToVtexCart(orderId) {
  const orderItems = {
    orderItems: [
      {
        quantity: 1,
        id: '5',
        seller: '1',
      }
    ]
  };
  const addToCartResponse = await fetch(`${VTEX_REST_API_URL}/checkout/pub/orderForm/${orderId}/items`, buildVtexPostRequestOptions(orderItems));
}

function buildVtexHttpHeaders() {
  const httpHeaders = new Headers();
  httpHeaders.append('Accept', 'application/json');
  httpHeaders.append('Content-Type', 'application/json');
  httpHeaders.append('VtexIdclientAutCookie', 'eyJhbGciOiJFUzI1NiIsImtpZCI6IkVGMDk0RDQ3QzQ3MzE2QUU3MkYyN0U4MTUwODdCNkQwQUU3MTc3NzMiLCJ0eXAiOiJqd3QifQ.eyJzdWIiOiJkaWVnby5kb25hZ2dpb0B2dGV4LmNvbS5iciIsImFjY291bnQiOiJiYWNhcmRpbWFydGluaSIsImF1ZGllbmNlIjoiYWRtaW4iLCJzZXNzIjoiMTYyMzE3YmItMTYxMS00ZGE1LWFiMGMtOTg3ZDRlZjFlYzIyIiwiZXhwIjoxNjM3MTQzNjI5LCJ1c2VySWQiOiI3ZDk2MmUyYS01MGI3LTQ4OGItODcyYy1kNzhlNDBlNDRlMjYiLCJpYXQiOjE2MzcwNTcyMjksImlzcyI6InRva2VuLWVtaXR0ZXIiLCJqdGkiOiJlNDgwNjEwYy1jY2Q3LTRmODYtOTY0MS00YmFiNWRmN2VlMDcifQ.RmPkgPnp1Fm6vW_HWHnnNHuR_aYHQwT2Teg3UMLx0BPyGtaBK4F1LO6zpvv2MH_hUZzNM96CAqeGiF2mARXWNw');
  httpHeaders.append('Cookie', '.ASPXAUTH=593B229858A07F187719FB4F133CCB4711E797F5E8769C321311C8CB9C527466C85964A8C3A4A9668BA20637742014E3E0A107978D854AD8667A5E7753A05A0492886B9633085F970E01C878B69E107FE483FC9A8532CB4EACADC3D736E1B7834D2E201E90E9DC8A4E729B776DED412BB9D82DCDB64756A8017672B7B0B7A2C3E410DE2CB289B32CB1430249178B30AA4D463A34372FCBF69BDF8FFF67250E897CBC8907; checkout.vtex.com=__ofid=44f36c1e3c5f4c09ae43a96bd3d9c218');
  return httpHeaders;
}

function buildVtexGetRequestOptions() {
  return {
    method: 'GET',
    headers: buildVtexHttpHeaders(),
    redirect: 'follow'
  };
}
function buildVtexPostRequestOptions(data) {
  return {
    method: 'POST',
    headers: buildVtexHttpHeaders(),
    body: JSON.stringify(data),
    redirect: 'follow',
  };
}

var userInfo = `
  { "lastname":"Lagache",
    "firstname":"Arnaud"}`;

var pageComponentsData = `
{
  "pageType": "home",
  "pageComponents": [
    {
      "componentType": "HeaderComponent",
      "componentVarname": "HeaderComponent",
      "order": 1
    },
    {
      "componentType": "FooterComponent",
      "componentVarname": "FooterComponent123545",
      "order": 2
    },
    {
      "componentType": "HeroComponent",
      "componentVarname": "HeroComponent123545",
      "order": 3
    },
    {
      "componentType": "TabContainer",
      "componentVarname": "TabContainer123545",
      "order": 4
    },
    {
      "componentType": "TicketCatalogComponent",
      "componentVarname": "catalog1378121271914",
      "order": 5
    }
  ]
}`;

var TabContainer123545 = `
[
  {
    "title": "My Requests",
    "description": "My Requests",
    "url": "./../../../../../assets/data/cmtickets.json",
    "alttext": ""
  },
  {
    "title": "History",
    "description": "History",
    "url": "./../../../../../assets/data/cmtickets.json",
    "alttext": ""
  }
]`;

var HeaderComponent = `
{
  "logo": {
    "image": "",
    "url": "logo url",
    "alttext": "logo alt text"
  },
  "usersettings": "No",
  "headerLinks": [
    {
      "title": "test title",
      "url": "",
      "alttext": ""
    }
  ]
}`;

var FooterComponent123545 = `
{
  "footerlinks": [
    {
      "title": "Terms of Use",
      "alttext": "Terms & Conditions",
      "url": "http://avaya.com/en/termsofuse/"
    },
    {
      "title": "Privacy",
      "alttext": "Privacy",
      "url": "http://avaya.com/en/privacy/commitment/"
    },
    {
      "title": "Cookies",
      "alttext": "Cookies",
      "url": "http://avaya.com/en/"
    },
    {
      "title": "Accessibility",
      "alttext": "Accessibility",
      "url": "http://avaya.com/en/accessibility/"
    }
  ],
  "footernote": "©2018 Avaya Inc. Avaya Inc., 4655 Great America Parkway, Santa Clara, CA 95054-1233 USA"
}`;

var HeroComponent123545 = `
{
  "herodesc": "How can we assist to take your business further?",
  "title": "Customer Care",
  "heroimage": {
    "alttext": "test",
    "image": "https://picsum.photos/2200/95"
  }
}`;

var catalog1378121271914 = `
[
  {
    "id": "1378121272225",
    "title": "Onboarding Help",
    "categoryassocs": [
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-ONBOARDING",
        "title": "PRM",
        "questionsassoc": "./../../../../../assets/data/questions.json",
        "context4": "Onboarding Help | PRM Navigation and Questions",
        "description": "Get assistance with Avaya, partner onboarding, promotion programs and marketing campaigns",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [
          {
            "url": "http://www.google.com",
            "title": "Google"
          },
          {
            "url": "http://www.google.com",
            "title": "Again Google"
          }
        ],
        "destination": "EMAIL"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-ONBOARDING",
        "title": "Other Enquiries",
        "questionsassoc": "./../../../../../assets/data/questions14.json",
        "context4": "Onboarding Help | PRM Cases",
        "description": "Get assistance with Avaya, partner onboarding, promotion programs and marketing campaigns",
        "kbtitle": "Other Enquiries FAQ's",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Ahhaaa !! I'm invincible",
        "kblinks": [
          {
            "url": "http://www.google.com",
            "title": "Google- Are you serious?"
          },
          {
            "url": "http://www.google.com",
            "title": "Not again"
          }
        ],
        "destination": "HPSM"
      }
    ],
    "description": "Learn how to conduct business with Avaya, partner onboarding, promotion programs and marketing campaigns",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1378121272321",
    "title": "Pre Sales Technical Support",
    "categoryassocs": [
      {
        "context2": "atacdemo1",
        "context1": "hvelloregang@avaya.com",
        "title": "Technical Questions",
        "questionsassoc": "/customercare/en/getQuestions/1397208968931",
        "context4": "",
        "description": "Get technical assistance with Avaya products",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [
          {
            "title": "Explore your soldto",
            "url": "https://support.avaya.com/public/index?page=content&id=PRCS100612",
            "alttext": "This is a test"
          }
        ],
        "destination": "Email"
      },
      {
        "context2": "atacdemo1",
        "context1": "atac@avaya.com",
        "title": "Designs and Tools Support",
        "questionsassoc": "/customercare/en/getQuestions/1397208969112",
        "context4": "",
        "description": "Get assistance to configure a consistent Avaya quote",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [
          {
            "title": "Explore your soldto",
            "url": "https://support.avaya.com/public/index?page=content&id=PRCS100612",
            "alttext": "This is a test"
          }
        ],
        "destination": "Email"
      }
    ],
    "description": "Get assistance to design solutions and answer feature functionality/interoperability questions",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1378121250904",
    "title": "Quoting & Ordering",
    "categoryassocs": [
      {
        "context2": "",
        "context1": "",
        "title": "Design/Quote a Solution",
        "questionsassoc": "/customercare/en/getQuestions/1397208969563",
        "context4": "",
        "description": "Get assistance with OneSource (A1S), Manual Orders and Customer Data",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-A1S",
        "title": "OneSource (A1S) Help",
        "questionsassoc": "/customercare/en/getQuestions/1397208969876",
        "context4": "A1S Support | Catalogue",
        "description": "Get a quote ready to order, including special bids, promotions and renewals",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-OKC",
        "title": "Manual Order",
        "questionsassoc": "/customercare/en/getQuestions/1397208969992",
        "context4": "Order Management | Manual PO Receipt",
        "description": "An order for products, service implementations requires additional documentation, manual intervention and/or approval to be processed",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-MAINTENANCE",
        "title": "Manual Maintenance Order",
        "questionsassoc": "/customercare/en/getQuestions/1397208970105",
        "context4": "Order Management | Manual PO Receipt",
        "description": "<p>An order for maintenance requires additional documentation, manual intervention and/or approval to be processed</p>",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Multi-Year Maintenance Order",
        "questionsassoc": "/customercare/en/getQuestions/1397208970233",
        "context4": "",
        "description": "Submit a subsequent purchase order supporting a multi-year maintenance contract",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-OM",
        "title": "License Key Generation",
        "questionsassoc": "/customercare/en/getQuestions/1397208970569",
        "context4": "Order Management | LAC not received",
        "description": "Get a license activation code for a software order",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Order Confirmation",
        "questionsassoc": "/customercare/en/getQuestions/1397208970701",
        "context4": "",
        "description": "Request an order confirmation and other enquiries",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Customer Data",
        "questionsassoc": "/customercare/en/getQuestions/1397208970829",
        "context4": "",
        "description": "Modify your (end-user) company records such as name, address, soldto codes etc…",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Cancel Maintenance",
        "questionsassoc": "/customercare/en/getQuestions/1397208970961",
        "context4": "",
        "description": "Request the cancelation of an existing maintenance contract",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      }
    ],
    "description": "Get assistance with OneSource (A1S), Manual Orders and Customer Data",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1378121272416",
    "title": "Order Fullfillment",
    "categoryassocs": [
      {
        "context2": "",
        "context1": "",
        "title": "Check Order Status",
        "questionsassoc": "/customercare/en/getQuestions/1397208972536",
        "context4": "",
        "description": "Questions or requests about an order (Delivery dates, Tracking #...)",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "License Key Generation",
        "questionsassoc": "/customercare/en/getQuestions/1397208972703",
        "context4": "",
        "description": "Get a license activation code for a software order",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Product Order Change",
        "questionsassoc": "/customercare/en/getQuestions/1397208972846",
        "context4": "",
        "description": "Request a change to your product order such as a partial shipment",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Claims",
        "questionsassoc": "/customercare/en/getQuestions/1397208973170",
        "context4": "",
        "description": "Incorrect delivery, damaged equipment and stock rotation requests",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      }
    ],
    "description": "Questions and issues about existing orders",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1378121272481",
    "title": "Invoice Management",
    "categoryassocs": [
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-COLLECTIONS",
        "title": "Payment",
        "questionsassoc": "/customercare/en/getQuestions/1397208973468",
        "context4": "Collections Team | Payment",
        "description": "Get assistance to pay an invoice",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "Other",
        "context1": "AVA-CUSTOPS-MAINTENANCE",
        "title": "Disputes",
        "questionsassoc": "/customercare/en/getQuestions/1397208973620",
        "context4": "Collections Team | Dispute",
        "description": "Dispute an invoice",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-COLLECTIONS",
        "title": "Transfers",
        "questionsassoc": "/customercare/en/getQuestions/1397208973764",
        "context4": "Collections Team | Transfer",
        "description": "Request a transfer of payment",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-COLLECTIONS",
        "title": "Refunds",
        "questionsassoc": "/customercare/en/getQuestions/1397208973922",
        "context4": "Collections Team | Refund",
        "description": "Request a refund",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-COLLECTIONS",
        "title": "Copy of Invoice",
        "questionsassoc": "/customercare/en/getQuestions/1397208974255",
        "context4": "Collections Team | Copy Invoice",
        "description": "Get a copy of your invoice",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "OTHER",
        "context1": "AVA-CUSTOPS-OKC",
        "title": "Cancel Maintenance",
        "questionsassoc": "/customercare/en/getQuestions/1397208974413",
        "context4": "Collections Team | Cancel Maintenance",
        "description": "<p>Request the cancelation of an existing maintenance contract</p>",
        "kbtitle": "Relevant Self-Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      }
    ],
    "description": "Payment and assistance with existing Avaya invoice. ",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1397208961931",
    "title": "Systems Help",
    "categoryassocs": [
      {
        "context2": "",
        "context1": "",
        "title": "My Profile",
        "questionsassoc": "/customercare/en/getQuestions/1397208974769",
        "context4": "",
        "description": "Get assistance to update SoldTo numbers, contact details (email, phone, address), location etc…",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "PLDS Licensing Tool",
        "questionsassoc": "/customercare/en/getQuestions/1397208974931",
        "context4": "",
        "description": "Get assistance on how to use PLDS or resolve PLDS not functioning as expected",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Other Licensing Tools",
        "questionsassoc": "/customercare/en/getQuestions/1397208975096",
        "context4": "",
        "description": "Get assistance on how to use KRS, GRT and other licensing tools or resolve them not functioning as expected",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Quoting Tools",
        "questionsassoc": "/customercare/en/getQuestions/1397208975436",
        "context4": "",
        "description": "Get assistance on how to use A1S, MSQT and other quoting tools or resolve them not functioning as expected",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      },
      {
        "context2": "",
        "context1": "",
        "title": "Other IT issues",
        "questionsassoc": "/customercare/en/getQuestions/1397208975613",
        "context4": "",
        "description": "Technical assistance for other issues/questions",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      }
    ],
    "description": "Technical assistance with using Avaya Systems",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "1397208962223",
    "title": "Other",
    "categoryassocs": [
      {
        "context2": "",
        "context1": "",
        "title": "Other Enquiries",
        "questionsassoc": "/customercare/en/getQuestions/1378121250915",
        "context4": "",
        "description": "If you did not find another selection to meet your needs",
        "kbtitle": "Relevant Self-Help",
        "context3": "",
        "kbdescription": "Review the below articles and FAQs",
        "kblinks": [],
        "destination": "HPSM"
      }
    ],
    "description": "If you did not find another selection to meet your needs",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "catalogMetadata",
    "title": "Create a Request",
    "description": "To request support, please choose from the listed categories to begin the process."
  }
]`;

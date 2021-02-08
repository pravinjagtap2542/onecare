var userInfo = `
{
  "E-mail":"kkasula@avaya.com",
  "Last_Name":"Asula",
  "First_Name":"Kalyan",
  "Phone_Number":"0123456789",
  "usertype":"Avaya Contractor"
}`;

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
      "order": 5
    },
    {
      "componentType": "TicketCatalogComponent",
      "componentVarname": "catalog1378121271914",
      "order": 6
    }
  ]
}`;

var TabContainer123545 = `
[
  {
    "title": "Requests",
    "description": "Review the list of opened requests below and take the relevant action",
    "url": "./../../../../../cs/cop/assets/data/cmtickets.json",
    "alttext": "Review the list of opened requests below and take the relevant action"
  },
  {
    "title": "History",
    "description": "Ticket History",
    "url": "./../../../../../cs/cop/assets/data/cmtickets.json",
    "alttext": "Review the list of opened requests below and take the relevant action"
  },
  {
    "title": "Delegation",
    "description": "Review the list of opened requests below and take the relevant action",
    "url": "./../../../../../cs/cop/assets/data/dgtickets.json",
    "alttext": "Review the list of opened requests below and take the relevant action"
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
      "title":"Service Outages",
      "url":"https://partner-itss.avaya.com",
      "alttext":"Service Outages"
    },

}`;

var FooterComponent123545 = `
{
  "footerlinks": [
    {
      "title": "Terms of Use",
      "alttext": "Terms & Conditions",
      "url": "http://avaya.com/en/termsofuse/"
    },

  ],
  "footernote": "©2018 Avaya Inc."
}`;

var Resources = `
{
  "resources": {
    "category": [
      {
        "title": "Products & Services",
        "links": [
          {
            "title": "11. diam in arcu cursus euismod diam in arcu cursus euismod diam in arcu cursus euismod diam in arcu cursus euismod",
            "alttext": "nostrud reprehenderit officia laborum do incididunt qui do duis aliqua non nulla non pariatur ipsum esse duis occaecat incididunt non",
            "url": "http://google.com/"
          }
        ]
      },
      {
        "title": "Tools & Related Documents",
        "links": [
          {
            "title": "vitae proin sagittis",
            "alttext": "do aute dolor tempor ad commodo proident anim qui do velit deserunt laboris aliquip mollit eu veniam enim aliqua nulla",
            "url": "http://google.com/"
          },
         
        ]
      }
    ]
  }
}
`;

var HeroComponent123545 = `
{
  "herodesc": "How can we assist to take your business further?",
  "title": "Customer Care",
  "heroimage": {
    "alttext": "test",
    "image": "https://picsum.photos/2200/95"
  }
}`;

var HeroComponent123546 = `
{
  "herodesc": "How can we assist ?",
  "title": "Site Care",
  "heroimage": {
    "alttext": "Another Hero",
    "image": "https://picsum.photos/2200/96"
  }
}`;

var catalog1378121271914 = `
[
  {
    "id": "1378121272225",
    "title": "Onboarding Help",
    "appendtotitle": "true",
    "displayinportal": "true",
    "tileicon": "./../../../../../cs/cop/assets/images/search.png",
    "categoryassocs": [
      
      {
        "id": "118",
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
        "id": "123",
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
        "id": "131",
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
        "id": "137",
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
        "id": "138",
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
    "id": "1397215135406",
    "title": "Storefront Support",
    "categoryassocs": [
      {
        "context2": "OTHER",
        "id": "1397215135581",
        "context1": "AVA-CUSTOPS-ONBOARDING",
        "title": "Storefront",
        "questionsassoc": "./../../../../../cs/cop/assets/data/storefront.json",
        "context4": "Onboarding Help | Access Issues, SSO or PRM",
        "description": "Get assistance with Avaya, partner onboarding, promotion programs and marketing campaigns",
        "kbtitle": "Self Help",
        "context3": "Service Suite - Customer Operations",
        "kbdescription": "Check articles relevant to this transaction",
        "kblinks": [
          {
            "title": "Avaya Support Site",
            "url": "https://support.avaya.com/",
            "alttext": "Avaya Support Site"
          }
        ],
        "destination": "siebel"
      }
    ],
    "description": "Learn how to conduct business with Avaya, partner onboarding, promotion programs and marketing campaigns",
    "CTALabel": "",
    "CTALink": ""
  },
  {
    "id": "catalogMetadata",
    "title": "Get Support",
    "description": "To request support, please choose from the listed categories to begin the process."
  },
  {
    "views":
    [
      {
        "id":"1397232617757",
        "title":"Partner Support",
        "defaultview":"Partner Support"
    },
      {
        "id":"1397232620024",
        "title":"IT Support"
    },
    {
      "id":"1397233719775",
      "title":"Storefront View"}
  ]
}
]`;

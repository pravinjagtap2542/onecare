export interface Ticket {
  ticketId:        string;
  startDate:       string;
  title:           string;
  status:          string;
  possibleActions: PossibleAction[];
}

export interface PossibleAction {
  id:   string;
  name: string;
}

export interface Hptickets {
  '@count':      number;
  '@start':      number;
  '@totalcount': number;
  Messages:      any[];
  ResourceName:  string;
  ReturnCode:    number;
  content:       Content[];
}

export interface Content {
  CustOpsInteraction: CustOpsInteraction;
  attachment: Attachment;
}

export interface CustOpsInteraction {
  AddlStatusUpdates?:           AddlStatusUpdates;
  Area?:                        Area;
  AssignmentGroup:              AssignmentGroup;
  Category:                     Category;
  Description:                  Array<null | string>;
  EUConnectivity?:              EUConnectivity;
  EnteredByESS?:                boolean;
  ExpectedResolution?:          string;
  Impact?:                      string;
  InteractionID:                string;
  Location:                     string;
  Medium?:                      Medium;
  NotifyBy:                     NotifyBy;
  OpenTime:                     string;
  OpenedBy:                     OpenedBy;
  Owner:                        Owner;
  PrimaryContact:               PrimaryContact;
  SLABreach:                    boolean;
  Service:                      string;
  ServiceArea?:                 ServiceArea;
  ServiceRecipient:             string;
  Severity:                     string;
  Status:                       Status;
  SubArea?:                     string;
  Title?:                       string;
  UpdateAction?:                Array<null | string>;
  Urgency?:                     string;
  PriorityMatrixAffectedUsers?: string;
  PriorityMatrixProactivity?:   string;
  CI?:                          string;
  ClosureCode?:                 ClosureCode;
  CloseTime?:                   string;
  Solution?:                    Array<null | string>;
  ForeignId?:                   string;
  SaveOk?:                      string;
  EscalateToIncident?:          boolean;
  NextBreach?:                  string;
}

export enum AddlStatusUpdates {
  No = 'no',
  Yes = 'yes',
}

export enum Area {
  AccessSecurity = 'Access/Security',
  AvailabilityPerformance = 'Availability/Performance',
  Data = 'Data',
  DeMilitarizedZoneDMZ = 'De-Militarized Zone (DMZ)',
  Functional = 'Functional',
  Headset = 'Headset',
  Information = 'Information',
  Other = 'Other',
  Reporting = 'Reporting',
  Service = 'service',
  ServiceCatalog = 'service catalog',
  ServiceSuiteAvayaLearning = 'Service Suite - Avaya Learning',
  Status = 'status',
}

export enum AssignmentGroup {
  AvaAlhdT1 = 'AVA-ALHD-T1',
  AvaCustopsA1S = 'AVA-CUSTOPS-A1S',
  AvaHDApps = 'AVA-HD-APPS',
  AvaHDCgn = 'AVA-HD-CGN',
  AvaHDExecSupp = 'AVA-HD-EXEC-SUPP',
  AvaHDMui = 'AVA-HD-MUI',
  AvaHDPartner = 'AVA-HD-PARTNER',
  BusinesspartnersEscalations = 'BUSINESSPARTNERS-ESCALATIONS',
  HelpdeskUnassignedQueue = 'HELPDESK-UNASSIGNED-QUEUE',
  ItAvaChat = 'IT-AVA-CHAT',
  LinkedInteractions = 'LINKED-INTERACTIONS',
}

export enum Category {
  Complaint = 'complaint',
  Incident = 'incident',
  RequestForInformation = 'request for information',
  ServiceCatalog = 'service catalog',
}

export enum ClosureCode {
  Obsolete = 'Obsolete',
  PassedToIncidentChangeProject = 'Passed to Incident/Change/Project',
  Successful = 'Successful',
  Workaround = 'Workaround',
}

export enum EUConnectivity {
  AvayaOfficeCabled = 'Avaya Office - Cabled',
  AvayaofficeCabled = 'avayaoffice-cabled',
  AvayaofficeWireless = 'avayaoffice-wireless',
  The3RdpartyofficeVPN = '3rdpartyoffice-vpn',
  VoCabled = 'vo-cabled',
  VoWireless = 'vo-wireless',
}

export enum Medium {
  Chat = 'Chat',
  CustomerOpsPortal = 'Customer Ops Portal',
  Ess = 'ESS',
  OneIT = 'OneIT',
  Phone = 'Phone',
}

export enum NotifyBy {
  EMail = 'E-mail',
  None = 'None',
  Telephone = 'Telephone',
}

export enum OpenedBy {
  Arnaudlagache = 'arnaudlagache',
  AvayaSTC = 'AvayaSTC',
  Guzmang = 'guzmang',
  TestApac = 'test_apac',
  TestEmea = 'test_emea',
  TestUs = 'test_us',
  Ws = 'ws',
  WsAisc = 'ws_aisc',
  WsAk = 'ws_ak',
  WsConversive = 'ws_conversive',
  WsCustomerops = 'ws_customerops',
  WsDss = 'ws_dss',
  WsEip = 'ws_eip',
  WsOd = 'ws_od',
  WsOneit = 'ws_oneit',
  WsVoice = 'ws_voice',
}

export enum Owner {
  Arnaudlagache = 'arnaudlagache',
  AvayaSTC = 'AvayaSTC',
  Guzmang = 'guzmang',
  Joubinacastr = 'joubinacastr',
  None = 'None',
  Ws = 'ws',
  WsAisc = 'ws_aisc',
  WsAk = 'ws_ak',
  WsConversive = 'ws_conversive',
  WsCustomerops = 'ws_customerops',
  WsDss = 'ws_dss',
  WsEip = 'ws_eip',
  WsOd = 'ws_od',
  WsOneit = 'ws_oneit',
  WsVoice = 'ws_voice',
}

export enum PrimaryContact {
  A15351Bp = 'A15351-BP',
  AabarcaBp = 'AABARCA-BP',
  Arnaudlagache = 'ARNAUDLAGACHE',
  Dinyar = 'DINYAR',
  Hdor = 'HDOR',
}

export enum ServiceArea {
  AccessSecurity = 'Access/Security',
  Applications = 'Applications',
  ConvergedNetwork = 'Converged Network',
  HardwareEndUser = 'Hardware - End User',
  Other = 'Other',
  Software = 'Software',
}

export enum Status {
  OpenIdle = 'Open - Idle',
  OpenInProgress = 'Open - In Progress',
  OpenLinked = 'Open - Linked',
  OpenWaitingForCustomer = 'Open - Waiting for Customer',
}

export interface HPSMTicket {
  Category:         string;
  PrimaryContact:   string;
  ServiceRecipient: string;
  Medium:           string;
  Service:          string;
  AssignmentGroup:  string;
  Title:            string;
  Description:      string[];
  Area:             string;
  SubArea:          string;
}


export interface SNOWTicket{
  u_entitlement: string;
  u_external_id: string;
  Short_Description: string;
  First_Name : string;
  Last_Name:string;
  E_Mail: string;
  Phone_Num:string;
  Description: string;
  u_state: string;
  u_impact: number;
  u_urgency: string;
  Company_Id: string;
  u_offer_name:string;
}
export interface HPSMCatalogItem {
  CatalogItemName:  string;
  RequestedBy:   string;
  RequestedFor: string;
  Options: string;
}

export interface HPSMTicketResp {
  CustOpsInteraction: CustOpsInteraction;
  Messages:           string[];
  ReturnCode:         number;
}

export interface Attachment {
  href:                string;
  len:                 number;
  name:                string;
  type:                string;
  'xmime:contentType': string;
}

export interface SiebelTicket {
  comment: string;
  createdBy: string;
  severity: string;
  description: any;
  subscription: string;
  srType: string;
}

export interface SiebelTicketResp {
  seibelResponse: string;
}

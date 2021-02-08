import { CustomerCareModule } from './customer-care.module';

describe('CustomerCareModule', () => {
  let customerCareModule: CustomerCareModule;

  beforeEach(() => {
    customerCareModule = new CustomerCareModule();
  });

  it('should create an instance', () => {
    expect(customerCareModule).toBeTruthy();
  });
});

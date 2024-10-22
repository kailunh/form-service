import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

export const schema = a.schema({
  IncomeReport: a.model({
      companyName: a.string().required(),
      companyAddress: a.string().required(),
      cityStateCountryZip: a.string().required(),
      ein: a.string().required(),
      dateIncorporated: a.string().required(),
      isInitialReturn: a.boolean().required(),
      isFinalReturn: a.boolean().required(),
      hasNameChanged: a.boolean().required(),
      hasAddressChanged: a.boolean().required(),
      shareholders: a.string().required(), // JSON string
      accountingMethod: a.string().required(),
      naicsCode: a.string().required(),
      address: a.string().required(),
      city: a.string().required(),
      state: a.string().required(),
      zipCode: a.string().required(),
      country: a.string().required(),
      createdAt: a.datetime().required(),
      updatedAt: a.datetime().required(),
  }).authorization(allow => [allow.owner().to(['create', 'read', 'update'])]),

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,

});

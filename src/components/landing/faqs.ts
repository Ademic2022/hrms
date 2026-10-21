/** Shown on the homepage and in its search-engine data, so both always match. */
export const FAQS: [string, string][] = [
  ["Who is it for?", "Companies with roughly 20 to 2,000 people that have outgrown spreadsheets and email for HR: one office or several, one legal entity or a group."],
  ["Does it do payroll?", "Not yet. Payroll with Nigerian PAYE, pension and NHF is what we are building next. Today you keep pay history on each record, and the pay summary report gives finance the totals."],
  ["Can staff use it on their phones?", "Yes. Employees request leave, check balances, update their details and see their documents from any phone browser. Managers approve from the same link they get by email."],
  ["How do we move our data in?", "Download the Excel template, fill in one row per person (or paste from what you use now) and upload it. Every row is checked first, and you get a list of anything to fix before anything is saved."],
  ["Who can see salaries and bank details?", "Only the people you allow. Pay and bank details are hidden from line managers by default, bank and ID numbers are encrypted, and every time someone views them it is written to the audit log."],
  ["We have several companies in a group. Does that work?", "Yes. Set up each legal entity, its offices and departments, and limit HR staff to the parts of the group they look after."],
  ["Is our data safe?", "Every company's records are kept separate from every other company's, sign-in supports two-step codes (required for admins by default), and you can limit access to your office network."],
];

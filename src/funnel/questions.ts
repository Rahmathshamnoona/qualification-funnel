export type Option = {
  label: string
  value: string
}

export type QuestionStep = {
  id: string
  dlKey: string
  shortLabel: string
  question: string
  hint?: string
  options: Option[]
}

export const QUESTIONS: QuestionStep[] = [
  {
    id: 'receiving_ben',
    dlKey: 'PPR_receiving_ben',
    shortLabel: 'Current benefits',
    question: 'Which of the following disability benefits are you currently receiving?',
    options: [
      { label: 'Social Security Disability (SSD) Benefits', value: 'Social Security Disability (SSD) Benefits' },
      { label: 'Supplemental Security Income (SSI) Benefits', value: 'Supplemental Security Income (SSI) Benefits' },
      { label: 'Both SSD and SSI Benefits', value: 'Both SSD and SSI Benefits' },
      {
        label: 'I am not receiving any disability benefits (SSD or SSI)',
        value: 'I am not receiving any disability benefits (SSD or SSI)',
      },
    ],
  },
  {
    id: 'page_sm72h5',
    dlKey: 'PPR_question_6kdqgg',
    shortLabel: 'Hours / week',
    question: 'How many hours per week are you currently working?',
    options: [
      { label: 'Not working', value: 'Not working' },
      { label: '20 hours or less per week', value: '20 hours or less per week' },
      { label: 'More than 20 hours per week', value: 'More than 20 hours per week' },
    ],
  },
  {
    id: 'lastworked',
    dlKey: 'PPR_lastWorked',
    shortLabel: 'Last worked',
    question: 'When did you last work?',
    options: [
      { label: 'Within the last 4 months', value: 'Within the last 4 months' },
      { label: '4 to 7 months ago', value: '4 to 7 months ago' },
      { label: '7 to 12 months ago', value: '7 to 12 months ago' },
      { label: 'More than 12 months ago', value: 'More than 12 months ago' },
    ],
  },
  {
    id: 'fiveyearwork',
    dlKey: 'PPR_fiveyearwork',
    shortLabel: 'Years employed',
    question: 'In the past 10 years, how many years have you been employed?',
    options: [
      { label: 'Less than 2 years', value: 'Less than 2 years' },
      { label: 'Between 2 and 4 years', value: 'Between 2 and 4 years' },
      { label: 'Between 4 and 6 years', value: 'Between 4 and 6 years' },
      { label: 'More than 6 years', value: 'More than 6 years' },
    ],
  },
  {
    id: 'page_lyensr',
    dlKey: 'PPR_assets_new',
    shortLabel: 'Assets',
    question: 'What is the total value of your assets? (Do not include house & car)',
    options: [
      { label: 'Less than $2,000', value: 'Less than $2000' },
      { label: 'More than $2,000', value: 'More than $2000' },
      { label: 'Not sure', value: 'Not Sure' },
    ],
  },
  {
    id: 'outofwork',
    dlKey: 'PPR_outofwork',
    shortLabel: 'Out of work',
    question: 'Do you expect to be out of work for at least a year due to a disability?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  {
    id: 'conditionstart',
    dlKey: 'PPR_conditionStart',
    shortLabel: 'Condition start',
    question: 'When did your condition start keeping you from working?',
    hint: 'An approximate date is fine. This is when your health started keeping you from working, not the date of diagnosis.',
    options: [
      { label: 'Within the last 6 months', value: 'Within the last 6 months' },
      { label: '6 to 12 months ago', value: '6 to 12 months ago' },
      { label: 'More than 1 year ago', value: 'More than 1 year ago' },
      { label: "I'm not sure", value: "I'm not sure" },
    ],
  },
  {
    id: 'visit',
    dlKey: 'PPR_visit',
    shortLabel: 'Seeing a doctor',
    question: 'Are you currently seeing a doctor or taking prescribed medication for a disability?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  {
    id: 'page_zbkz5e',
    dlKey: 'PPR_visit_new',
    shortLabel: 'Last visit',
    question: 'When was the last time you visited a doctor?',
    options: [
      { label: 'Within last 12 months', value: 'Within last 12 months' },
      { label: 'More than 12 months ago', value: 'More than 12 months ago' },
      { label: "I haven't had one", value: "I haven't had one" },
    ],
  },
  {
    id: 'page_igxwft',
    dlKey: 'PPR_pendingApl',
    shortLabel: 'Pending application',
    question: 'Do you have a pending application for Social Security Disability (SSD) benefits?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  {
    id: 'attorney',
    dlKey: 'PPR_atty',
    shortLabel: 'Has attorney',
    question: 'Is an attorney or advocate currently representing you for this SSD application?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  {
    id: 'attorneyfirm',
    dlKey: 'PPR_atty_firm',
    shortLabel: 'Attorney firm',
    question: 'Which firm is currently helping you with your disability application?',
    options: [
      { label: 'Trajector Disability', value: 'Trajector Disability' },
      { label: 'Premier Disability', value: 'Premier Disability' },
      { label: 'Citizens Disability', value: 'Citizens Disability' },
      { label: 'Nyman Turkish PC', value: 'Nyman Turkish PC' },
      { label: 'Allsup', value: 'Allsup' },
      { label: 'Quikaid', value: 'Quikaid' },
      { label: 'Kirkendall Dwyer LLP', value: 'Kirkendall Dwyer LLP' },
      { label: 'Newlin Disability', value: 'Newlin Disability' },
      { label: 'Other / None of the above', value: 'Other / None of the above' },
    ],
  },
  {
    id: 'page_9rrpa3',
    dlKey: 'application_denied',
    shortLabel: 'Application denied',
    question: 'Was your Disability application denied?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  {
    id: 'page_sozf2w',
    dlKey: 'appeal_filed',
    shortLabel: 'Claim stage',
    question: 'Where are you in the process?',
    options: [
      { label: 'Waiting on first decision', value: 'Waiting on first decision' },
      { label: 'First decision was denied', value: 'First decision was denied' },
      { label: 'I requested reconsideration', value: 'I requested reconsideration' },
      { label: 'I requested a hearing', value: 'I requested a hearing' },
    ],
  },
  {
    id: 'page_reconstatus',
    dlKey: 'reconsideration_status',
    shortLabel: 'Reconsideration',
    question: "What's the status of your reconsideration?",
    options: [
      { label: 'Got denied', value: 'Got denied' },
      { label: 'Pending', value: 'Pending' },
    ],
  },
  {
    id: 'page_denialage',
    dlKey: 'denial_age',
    shortLabel: 'Denial timing',
    question: 'About how long ago did you get the denial?',
    options: [
      { label: 'Less than 45 days ago', value: 'Less than 45 days ago' },
      { label: 'More than 45 days ago', value: 'More than 45 days ago' },
    ],
  },
  {
    id: 'page_doic6e',
    dlKey: 'hearing_status',
    shortLabel: 'Hearing status',
    question: "What's the current status of your hearing?",
    options: [
      { label: 'Waiting to be scheduled', value: 'Waiting to be scheduled' },
      { label: 'A hearing is scheduled', value: 'A hearing is scheduled' },
      { label: 'Hearing already happened — waiting on a decision', value: 'Hearing already happened - waiting on a decision' },
    ],
  },
  {
    id: 'page_ddujlp',
    dlKey: 'waiting_period',
    shortLabel: 'Wait time',
    question: 'How long have you been waiting?',
    options: [
      { label: 'Less than 3 months', value: 'Less than 3 Months' },
      { label: '3 – 6 months', value: '3 – 6 Months' },
      { label: '6 – 9 months', value: '6 – 9 Months' },
      { label: 'More than 9 months', value: 'More than 9 Months' },
    ],
  },
  {
    id: 'page_6dkfid',
    dlKey: 'PPR_hearingScheduled',
    shortLabel: 'Hearing month',
    question: 'In which month is your hearing scheduled?',
    options: [
      { label: 'May', value: 'May' },
      { label: 'June', value: 'June' },
      { label: 'July', value: 'July' },
      { label: 'August', value: 'August' },
      { label: 'September', value: 'September' },
      { label: 'October', value: 'October' },
      { label: 'November', value: 'November' },
      { label: 'December', value: 'December' },
      { label: 'Next year', value: 'Next year (2027)' },
    ],
  },
  {
    id: 'page_1kwm6b',
    dlKey: 'PPR_optin_gender',
    shortLabel: 'Gender',
    question: 'How do you identify your gender?',
    options: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
      { label: 'Non-binary', value: 'Non - Binary' },
      { label: 'Prefer not to respond', value: 'Prefer not to respond' },
    ],
  },
  {
    id: 'page_uhs14w',
    dlKey: 'PPR_optin_age',
    shortLabel: 'Age range',
    question: 'Please select the option that represents your age range',
    options: [
      { label: 'Under 40', value: 'Under 40' },
      { label: '40–49', value: '40-49' },
      { label: '50–54', value: '50-54' },
      { label: '55–63', value: '55-63' },
      { label: '64 or older', value: '64 or older' },
    ],
  },
  {
    id: 'page_8w2qbu',
    dlKey: 'PPR_maritalStatus_new',
    shortLabel: 'Marital status',
    question: 'What is your current marital status?',
    options: [
      { label: 'Single', value: 'Single' },
      { label: 'Married', value: 'Married' },
      { label: 'Widowed', value: 'Widowed' },
      { label: 'Divorced', value: 'Divorced' },
      { label: 'Separated (not receiving support)', value: 'Separated (Not receiving support)' },
    ],
  },
]

export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((step) => [step.id, step])) as Record<
  string,
  QuestionStep
>

// Job Listing Schema for Juniper Edge CMS
export default {
  name: 'job',
  title: 'Job Listing',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'country',
      title: 'Country',
      type: 'string',
      options: {
        list: [
          { title: 'Canada', value: 'canada' },
          { title: 'UAE', value: 'uae' },
          { title: 'Qatar', value: 'qatar' },
          { title: 'Saudi Arabia', value: 'saudi' },
          { title: 'Oman', value: 'oman' },
          { title: 'Luxembourg', value: 'luxembourg' },
          { title: 'Turkey', value: 'turkey' },
          { title: 'Mauritius', value: 'mauritius' },
        ],
        layout: 'dropdown',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Skilled Worker', value: 'skilled' },
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'IT & Tech', value: 'tech' },
          { title: 'Construction', value: 'construction' },
          { title: 'General Labour', value: 'labour' },
        ],
        layout: 'dropdown',
      },
    },
    {
      name: 'salary',
      title: 'Salary Range (e.g. "CAD 3,200 - 4,800/month")',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Job Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'requirements',
      title: 'Requirements',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'slots',
      title: 'Open Slots',
      type: 'number',
    },
    {
      name: 'deadline',
      title: 'Application Deadline',
      type: 'date',
    },
    {
      name: 'isUrgent',
      title: 'Mark as Urgent?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isActive',
      title: 'Show on Website?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'countryFlag',
      title: 'Country Flag Emoji',
      type: 'string',
      description: 'Paste the flag emoji, e.g. 🇨🇦',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'country',
    },
    prepare({ title, subtitle }) {
      const flags = { canada: '🇨🇦', uae: '🇦🇪', qatar: '🇶🇦', saudi: '🇸🇦', oman: '🇴🇲', luxembourg: '🇱🇺', turkey: '🇹🇷', mauritius: '🇲🇺' }
      return { title, subtitle: `${flags[subtitle] || ''} ${subtitle}` }
    },
  },
}

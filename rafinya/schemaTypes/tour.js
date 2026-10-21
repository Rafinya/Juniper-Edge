// Tour Package Schema for Juniper Edge CMS
export default {
  name: 'tour',
  title: 'Tour Package',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Tour Title',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Safari & Wilderness', value: 'safari' },
          { title: 'Beach & Coastal', value: 'coastal' },
          { title: 'International Luxury', value: 'intl' },
          { title: 'Group & Adventure', value: 'group' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    },
    {
      name: 'badge',
      title: 'Badge Label (e.g. "Upcoming Adventure")',
      type: 'string',
    },
    {
      name: 'badgeIcon',
      title: 'Badge Icon (Font Awesome class, e.g. "fa-fire")',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Tour Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text', type: 'string' }],
    },
    {
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(400),
    },
    {
      name: 'price',
      title: 'Price (KES)',
      type: 'number',
    },
    {
      name: 'priceLabel',
      title: 'Price Label (e.g. "Per Person")',
      type: 'string',
    },
    {
      name: 'duration',
      title: 'Duration (e.g. "3 Days / 2 Nights")',
      type: 'string',
    },
    {
      name: 'destination',
      title: 'Destination',
      type: 'string',
    },
    {
      name: 'highlights',
      title: 'Tour Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'itineraryDay',
          fields: [
            { name: 'time', title: 'Time / Day Label', type: 'string' },
            { name: 'title', title: 'Activity Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'time', subtitle: 'title' } },
        },
      ],
    },
    {
      name: 'isUpcoming',
      title: 'Upcoming Trip?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isFeatured',
      title: 'Feature on Homepage?',
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
      name: 'inquiryLink',
      title: 'Custom Booking/WhatsApp Link (optional)',
      type: 'url',
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'destination', media: 'image' },
  },
}

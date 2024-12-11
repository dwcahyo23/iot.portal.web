import { Box, Button, Group, Select, TextInput } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import * as Yup from 'yup'

interface FormToolBatchProps {
  onSave: (data: { mcCd: string; mcComId: string; usage: number }) => void
}

// Define the validation schema using Yup
const schema = Yup.object().shape({
  mcCd: Yup.string().required('Machine Code is required'),
  mcComId: Yup.string().required('Machine Component ID is required'),
  usage: Yup.number().required('Usage is required').min(0, 'Usage must be at least 0')
})

export const FormToolBatch: React.FC<FormToolBatchProps> = ({ onSave }) => {
  const form = useForm({
    initialValues: {
      mcCd: '',
      mcComId: '01',
      usage: 0
    },
    validate: yupResolver(schema)
  })

  const handleSubmit = (values: typeof form.values) => {
    onSave({
      mcCd: values.mcCd,
      mcComId: values.mcComId,
      usage: Number(values.usage)
    })
  }

  return (
    <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput label="Machine Code" {...form.getInputProps('mcCd')} required mb="sm" />

      <Select
        label="Machine Component ID"
        data={[
          { value: '01', label: 'GM1' },
          { value: '02', label: 'GM2' },
          { value: '03', label: 'GM3' },
          { value: '05', label: 'GM5' }
        ]}
        {...form.getInputProps('mcComId')}
        required
        mb="sm"
      />

      <TextInput label="Usage" type="number" {...form.getInputProps('usage')} required mb="sm" />

      <Group mt="md">
        <Button type="submit">Save</Button>
      </Group>
    </Box>
  )
}

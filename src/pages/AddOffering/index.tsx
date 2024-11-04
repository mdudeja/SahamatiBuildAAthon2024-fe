import { useLocation } from "preact-iso"
import {
  OfferingFormField,
  OfferingFormFields,
} from "../../lib/OfferingFormFields"
import { useEffect, useState } from "preact/hooks"
import { AppForm } from "../../components/AppForm"

export function AddOffering() {
  const { query, path } = useLocation()
  const [formFields, setFormFields] = useState<OfferingFormField[]>([])

  useEffect(() => {
    setFormFields(OfferingFormFields[query.type])
  }, [query, path])

  return <AppForm fields={formFields} title={query.type}></AppForm>
}

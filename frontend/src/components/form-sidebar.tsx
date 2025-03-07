"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Form {
  _id: string;
  name: string;
  components: any[];
}

interface FormElement {
  id: string;
  label: string;
  type: string;
  key?: string;
  placeholder?: string;
  defaultValue?: string;
  options?: string[];
  tableView?: boolean;
  inputType?: string;
  validate?: FormElementValidation;
}

interface FormElementValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  customPrivate?: boolean;
}

export default function FormSidebar(props) {
  const [forms, setForms] = useState<Form[]>([]);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    async function fetchForms() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/form/get-all`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setForms(data);
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    }

    fetchForms();
  }, []);

  const transformFormElements = (components: any[]): FormElement[] => {
    return components.map((component) => ({
      id: `${component.key}-${Date.now()}`,
      label: component.label || '',
      type: component.type || 'text',
      key: component.key,
      placeholder: component.placeholder,
      defaultValue: component.defaultValue,
      options: component.options,
      tableView: component.tableView,
      inputType: component.inputType,
      validate: component.validate,
    }));
  };

  return (
    <div className="w-64 bg-gray-100 border-r p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">My Forms</h2>

      <ScrollArea className="flex-1">
        {forms.map((form) => (
          <div
            key={form._id}
            onClick={() => {
              const transformedElements = transformFormElements(form.components);
              props.setElements([]);
    
              setTimeout(() => {
                  props.setElements(transformedElements);
                  props.setFormName(form.name);
                  props.setFormId(form._id);
                  setSelectedForm(form);
              }, 50);
            }}
            className={`p-2 rounded-md cursor-pointer mb-2 ${
              selectedForm?._id === form._id ? "bg-gray-500 text-white" : "bg-white hover:bg-gray-200"
            }`}
          >
            {form.name}
          </div>
        ))}
      </ScrollArea>

      <Button 
        className="mt-4 w-full"
        onClick={() => {
          props.setElements([]);
          props.setFormName("New Form");
          props.setFormId(undefined);
          setSelectedForm(null);
        }}
      >
        + Create New Form
      </Button>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Certificate } from "@/types"; // <-- Import the shared type

const formSchema = z.object({
  studentName: z.string().min(2, { message: "Name is too short." }),
  studentEmail: z.string().email(),
  degreeName: z.string().min(2, { message: "Degree name is too short." }),
  degreeSubject: z.string().min(2, { message: "Subject is too short." }),
  issueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
});

interface IssueCertificateFormProps {
  onCertificateIssued: (newCertificate: Certificate) => void; // <-- Use the specific Certificate type
}

export function IssueCertificateForm({
  onCertificateIssued,
}: IssueCertificateFormProps) {
  const auth = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      studentEmail: "",
      degreeName: "",
      degreeSubject: "",
      issueDate: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth.token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/certificates/issue",
        { ...values, issueDate: new Date(values.issueDate) },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        },
      );

      toast.success("Certificate Issuance Started!", {
        description: `Job for ${response.data.studentName} has been dispatched.`,
      });
      onCertificateIssued(response.data);
      form.reset();
    } catch {
      // <-- Cleaned up unused 'error' variable
      toast.error("Issuance Failed", {
        description: "Could not start the certificate issuance process.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issue a New Certificate</CardTitle>
        <CardDescription>
          Fill in the details below to start the process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Email</FormLabel>
                  <FormControl>
                    <Input placeholder="student@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degreeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bachelor of Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degreeSubject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Issue Certificate</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

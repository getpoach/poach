import { redirect } from "next/navigation";

export default function ChefIndex() {
  redirect("/chef/dashboard");
}
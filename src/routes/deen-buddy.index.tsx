import { createFileRoute } from "@tanstack/react-router";
import { DeenBuddyEmpty } from "./deen-buddy";

export const Route = createFileRoute("/deen-buddy/")({
  component: DeenBuddyEmpty,
});

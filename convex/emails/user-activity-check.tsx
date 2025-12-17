import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
  Preview,
  Heading,
} from "@react-email/components";

const UserActivityCheckEmail = (props: {
  userName?: string;
  lastActiveDate?: string;
  companyName?: string;
}) => {
  const {
    userName = "there",
    lastActiveDate = "a while",
    companyName = "Our Platform",
  } = props;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Preview>We miss you! Come back and see what's new</Preview>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white mx-auto px-10 py-10 rounded-xl max-w-15-">
            {/* Header */}
            <Section className="text-center mb-8">
              <Text className="text-[16px] text-gray-600 m-0">
                It's been {lastActiveDate} since we last saw you
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="text-[16px] text-gray-800 mb-4 leading-6">
                Hi {userName},
              </Text>

              <Text className="text-[16px] text-gray-800 mb-4 leading-6">
                We noticed you haven't been around lately, and we wanted to
                reach out to make sure everything's okay. Your account has been
                quiet.
              </Text>

              <Text className="text-[16px] text-gray-800 mb-6 leading-6">
                Simply let us know you're still with us,by clicking the button
                below.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-6">
                <Button
                  href="https://yourplatform.com/login"
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[16px] font-medium no-underline box-border inline-block"
                >
                  Reset the Inactivity Status
                </Button>
              </Section>
            </Section>

            <Hr className="border-gray-200 my-6" />

            {/* Account Status Notice */}
            <Section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <Text className="text-[14px] text-yellow-800 m-0 mb-2 font-medium">
                Note:
              </Text>
              <Text className="text-[14px] text-yellow-700 m-0 leading-5">
                If you do not reply then then your trusted contacts will be
                notified.
              </Text>
            </Section>

            {/* Footer */}
            <Section>
              <Text className="text-[12px] text-gray-500 leading-5 m-0">
                {companyName} Inc.
                <br />
                123 Business Street, Suite 100
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </Text>
              <Text className="text-[12px] text-gray-500 leading-5 mt-4 m-0">
                © {new Date().getFullYear()} {companyName}. All rights reserved.
                <br />
                <a
                  href="https://yourplatform.com/privacy"
                  className="text-gray-500 underline"
                >
                  Privacy Policy
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

UserActivityCheckEmail.PreviewProps = {
  userName: "Alex",
  lastActiveDate: "2 weeks",
  companyName: "Our Platform",
};

export default UserActivityCheckEmail;

/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import styled from '@emotion/styled';
import {
  Field, Form, Formik, FormikHelpers,
} from 'formik';
import { useNavigate } from 'react-router-dom';

export const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #252525;
`;

export const SpaceContainer = styled.div`
  flex: 1;
`;

export const BigText = styled.h1`
  font-size: 3rem;
`;

const ContentContainer = styled.div`
  display: flex;
  flex：direction: row;
  justify-content: center;
  flex: 6;
`;

const FormContainer = styled.div`
  height: 100%;
  width: 35%;
  display: flex;
  flex-direction: column;
`;

const CustomForm = styled(Form)`
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 50px;
  margin-right: 50px;
  justify-content: space-evenly;
`;

const CustomField = styled(Field)`
  border-radius: 8px;
  background-color: #e5e5e5;
  width: 100%;
  height: 30px;
  min-width: 200px;
  max-width: 400px;
`;

const HalfCustomField = styled(CustomField)`
min-width: 100px;
max-width: 200px;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ConfirmButton = styled.button`
  border-radius: 10px;
  background-color: #e5e5e5;
  width: 180px;
  height: 50px;
  align-self: center;
`;

const LabelText = styled.h1`
  font-size: 1.1rem;
  color: white;
  margin-bottom: 4px;
`;

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}

function SignUp() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <SpaceContainer className="">
        <img
          alt="logo"
          className="w-1/5 m-6"
          // eslint-disable-next-line global-require
          src={require('../image/logoHorizontal.png')}
        />
      </SpaceContainer>
      <ContentContainer>
        <FormContainer className="">
          <BigText className="text-white"> Complete your profile </BigText>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
            }}
            onSubmit={(
              values: Values,
              { setSubmitting }: FormikHelpers<Values>,
            ) => {
              setTimeout(() => {
                // ToDo: Navigate to browse tournament
                // alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
                navigate('/dashboard');
              }, 500);
            }}
          >
            <CustomForm className="">
              <div className="flex justify-between">
                <div className="flex flex-col items-start">
                  <label htmlFor="firstName">
                    <LabelText>First Name</LabelText>
                  </label>
                  <HalfCustomField
                    id="firstName"
                    name="firstName"
                    placeholder="  John"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <label htmlFor="lastName">
                    <LabelText>Last Name</LabelText>
                  </label>
                  <HalfCustomField
                    id="lastName"
                    name="lastName"
                    placeholder="  Doe"
                  />
                </div>
              </div>

              <ColumnContainer className="flex items-start">
                <label htmlFor="phoneNumber">
                  <LabelText> phoneNumber </LabelText>
                </label>
                <CustomField
                  id="phoneNummber"
                  name="phoneNummber"
                  placeholder="  7781234567"
                  type="phoneNummber"
                />
              </ColumnContainer>

              <ColumnContainer className="flex items-start">
                <label htmlFor="email">
                  <LabelText> Email </LabelText>
                </label>
                <CustomField
                  id="email"
                  name="email"
                  placeholder="  john@acme.com"
                  type="email"
                />
              </ColumnContainer>

              <ColumnContainer className="flex items-start">
                <label htmlFor="Department">
                  <LabelText>Department</LabelText>
                </label>
                <CustomField
                  id="department"
                  name="department"
                  placeholder="  john@acme.com"
                />
              </ColumnContainer>

              <ColumnContainer className="flex items-start">
                <label htmlFor="Position">
                  <LabelText> Position </LabelText>
                </label>
                <CustomField
                  id="Position"
                  name="Position"
                  placeholder="  john@acme.com"
                />
              </ColumnContainer>

              <ConfirmButton className="mt-4" type="submit">Confirm</ConfirmButton>
            </CustomForm>
          </Formik>
        </FormContainer>
      </ContentContainer>
      <SpaceContainer />
    </PageContainer>
  );
}

export default SignUp;

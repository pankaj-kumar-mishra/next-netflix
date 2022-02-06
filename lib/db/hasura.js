/*
This is an example snippet - you should consider tailoring it
to your service.
*/

export const fetchGraphQL = async (
  operationsDoc,
  operationName,
  variables,
  token
) => {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      operationName: operationName,
      variables: variables,
    }),
  });

  return await result.json();
};

// NOTE "!" means it is important, we need to pass
export const isNewUser = async (token, issuer) => {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
    }
  }
`;

  const response = await fetchGraphQL(
    operationsDoc,
    "isNewUser",
    {
      issuer,
    },
    token
  );

  return response?.data?.users?.length === 0;
};

export const createNewUser = async (token, metadata) => {
  const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        id
        email
        issuer
      }
    }
  }
`;

  const { issuer, email, publicAddress } = metadata;
  const response = await fetchGraphQL(
    operationsDoc,
    "createNewUser",
    {
      issuer,
      email,
      publicAddress,
    },
    token
  );

  return response;
};

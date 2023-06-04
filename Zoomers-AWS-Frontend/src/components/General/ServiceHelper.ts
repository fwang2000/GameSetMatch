export default function handleErrors(response:any) {
  if (!response.ok) {
    return response.json().then((text:any) => {
      if (text.message) {
        // TODO type this error
        throw new Error(text.message);
      }
      // TODO type this error
      throw new Error(text.error);
    });
  }
  return response;
}

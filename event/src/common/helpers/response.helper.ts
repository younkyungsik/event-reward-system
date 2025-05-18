export function successResponse(message: string, data: any) {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, data: any) {
  return {
    success: false,
    message,
    data,
  };
}

const isDevBuild = (process.env.NODE_ENV === 'development');
export const URL = isDevBuild ? "http://localhost:8000/" : "/";

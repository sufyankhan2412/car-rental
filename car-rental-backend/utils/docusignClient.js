import docusign from 'docusign-esign';

const apiClient = new docusign.ApiClient();

// Configure DocuSign client
export const configureDocuSign = () => {
  const basePath = process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi';
  apiClient.setBasePath(basePath);
  
  return apiClient;
};

// Get JWT token for authentication
export const getJWTToken = async () => {
  try {
    const privateKey = Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY || '', 'base64').toString('utf-8');
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;
    
    const scopes = ['signature', 'impersonation'];
    
    const results = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      scopes,
      privateKey,
      3600 // 1 hour
    );
    
    const accessToken = results.body.access_token;
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
    
    return accessToken;
  } catch (error) {
    console.error('JWT Token Error:', error);
    throw new Error('Failed to get DocuSign JWT token');
  }
};

// Get user info
export const getUserInfo = async (accessToken) => {
  try {
    const userInfoUrl = process.env.DOCUSIGN_BASE_PATH?.replace('/restapi', '') || 'https://demo.docusign.net';
    apiClient.setBasePath(userInfoUrl);
    
    const userInfo = await apiClient.getUserInfo(accessToken);
    
    // Reset base path
    apiClient.setBasePath(process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi');
    
    return userInfo;
  } catch (error) {
    console.error('Get User Info Error:', error);
    throw new Error('Failed to get DocuSign user info');
  }
};

export default apiClient;

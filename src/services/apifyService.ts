import { supabase } from '../lib/supabase';

interface ApifyRunOptions {
  actorId: string;
  input: Record<string, any>;
  waitForFinish?: boolean;
}

interface ApifyDatasetOptions {
  datasetId: string;
  limit?: number;
  offset?: number;
  fields?: string[];
}

class ApifyService {
  // Call Apify API through our Edge Function
  private async callApifyApi(endpoint: string, method: string = 'GET', body?: any): Promise<any> {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      // Prepare the URL with query parameters
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/apify-api`);
      url.searchParams.append('endpoint', endpoint);
      url.searchParams.append('method', method);

      // Call the Edge Function
      const response = await fetch(url.toString(), {
        method: method === 'GET' ? 'GET' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Apify API request failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Apify API error:', error);
      throw new Error(error.message || 'Failed to call Apify API');
    }
  }

  // Run an actor
  async runActor(options: ApifyRunOptions): Promise<any> {
    try {
      const { actorId, input, waitForFinish = true } = options;
      
      const endpoint = `acts/${actorId}/runs`;
      const body = {
        input,
        waitForFinish
      };
      
      return await this.callApifyApi(endpoint, 'POST', body);
    } catch (error: any) {
      console.error('Error running Apify actor:', error);
      throw new Error(error.message || 'Failed to run Apify actor');
    }
  }

  // Get dataset items
  async getDatasetItems(options: ApifyDatasetOptions): Promise<any[]> {
    try {
      const { datasetId, limit = 100, offset = 0, fields } = options;
      
      let endpoint = `datasets/${datasetId}/items?limit=${limit}&offset=${offset}`;
      
      if (fields && fields.length > 0) {
        endpoint += `&fields=${fields.join(',')}`;
      }
      
      const response = await this.callApifyApi(endpoint);
      return response.data || [];
    } catch (error: any) {
      console.error('Error getting Apify dataset items:', error);
      throw new Error(error.message || 'Failed to get Apify dataset items');
    }
  }

  // Get actor details
  async getActorDetails(actorId: string): Promise<any> {
    try {
      const endpoint = `acts/${actorId}`;
      return await this.callApifyApi(endpoint);
    } catch (error: any) {
      console.error('Error getting Apify actor details:', error);
      throw new Error(error.message || 'Failed to get Apify actor details');
    }
  }

  // Get run details
  async getRunDetails(runId: string): Promise<any> {
    try {
      const endpoint = `actor-runs/${runId}`;
      return await this.callApifyApi(endpoint);
    } catch (error: any) {
      console.error('Error getting Apify run details:', error);
      throw new Error(error.message || 'Failed to get Apify run details');
    }
  }

  // Get run status
  async getRunStatus(runId: string): Promise<string> {
    try {
      const details = await this.getRunDetails(runId);
      return details.status || 'UNKNOWN';
    } catch (error: any) {
      console.error('Error getting Apify run status:', error);
      throw new Error(error.message || 'Failed to get Apify run status');
    }
  }

  // Wait for run to finish
  async waitForRunToFinish(runId: string, maxWaitTimeMs: number = 300000): Promise<any> {
    try {
      const startTime = Date.now();
      let status = await this.getRunStatus(runId);
      
      while (status !== 'SUCCEEDED' && status !== 'FAILED' && status !== 'ABORTED') {
        // Check if we've exceeded the maximum wait time
        if (Date.now() - startTime > maxWaitTimeMs) {
          throw new Error(`Timeout waiting for run ${runId} to finish`);
        }
        
        // Wait for 5 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check status again
        status = await this.getRunStatus(runId);
      }
      
      if (status === 'FAILED' || status === 'ABORTED') {
        throw new Error(`Run ${runId} ${status.toLowerCase()}`);
      }
      
      return await this.getRunDetails(runId);
    } catch (error: any) {
      console.error('Error waiting for Apify run to finish:', error);
      throw new Error(error.message || 'Failed to wait for Apify run to finish');
    }
  }
}

// Export singleton instance
export const apifyService = new ApifyService();
require('dotenv').config({ path: '../.env' });

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || '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';

// Helper function to call HuggingFace API using fetch
const callHuggingFaceAPI = async (model, inputs) => {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ inputs })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HuggingFace API Error for ${model}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error calling HuggingFace API for ${model}:`, error.message);
    throw new Error(`Failed to analyze with ${model}`);
  }
};

// Analyze resume and job description
const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    // Debug: Check if API key is loaded
    console.log('HuggingFace API Key loaded:', HUGGINGFACE_API_KEY ? 'Yes' : 'No');
    console.log('API Key length:', HUGGINGFACE_API_KEY ? HUGGINGFACE_API_KEY.length : 0);

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume text and job description are required'
      });
    }

    // Prepare the combined text for analysis
    const combinedText = `Resume: ${resumeText}\nJob Description: ${jobDescription}`;

    // Call all three models in parallel using exact syntax
    const [summaryResult, keywordsResult, matchResult] = await Promise.allSettled([
      // 1. Summarize resume using BART
      callHuggingFaceAPI('facebook/bart-large-cnn', resumeText),
      
      // 2. Extract missing keywords using FLAN-T5
      callHuggingFaceAPI('google/flan-t5-base', `Suggest missing keywords for this job description: ${jobDescription}`),
      
      // 3. Generate match score and suggestions using FLAN-T5
      callHuggingFaceAPI('google/flan-t5-base', `Compare resume: ${resumeText} with job description: ${jobDescription} and return a match score (0-100) with improvement suggestions.`)
    ]);

    // Process summary result
    let summary = "Unable to generate summary at this time.";
    if (summaryResult.status === 'fulfilled' && summaryResult.value) {
      console.log('Summary result:', summaryResult.value);
      if (Array.isArray(summaryResult.value) && summaryResult.value[0]) {
        summary = summaryResult.value[0].summary_text || summaryResult.value[0].generated_text || summary;
      } else if (summaryResult.value.summary_text) {
        summary = summaryResult.value.summary_text;
      } else if (summaryResult.value.generated_text) {
        summary = summaryResult.value.generated_text;
      }
    }

    // Process keywords result
    let missingKeywords = [];
    if (keywordsResult.status === 'fulfilled' && keywordsResult.value) {
      console.log('Keywords result:', keywordsResult.value);
      let keywordsText = '';
      if (Array.isArray(keywordsResult.value) && keywordsResult.value[0]) {
        keywordsText = keywordsResult.value[0].generated_text || '';
      } else if (keywordsResult.value.generated_text) {
        keywordsText = keywordsResult.value.generated_text;
      }
      
      // Extract keywords from the response
      missingKeywords = keywordsText
        .split(/[,\n;]/)
        .map(k => k.trim())
        .filter(k => k.length > 2 && k.length < 50)
        .slice(0, 10); // Limit to 10 keywords
    }

    // Process match score result
    let matchScore = 50; // Default score
    let improvementSuggestions = "Consider adding more relevant skills and experience.";
    
    if (matchResult.status === 'fulfilled' && matchResult.value) {
      console.log('Match result:', matchResult.value);
      let matchText = '';
      if (Array.isArray(matchResult.value) && matchResult.value[0]) {
        matchText = matchResult.value[0].generated_text || '';
      } else if (matchResult.value.generated_text) {
        matchText = matchResult.value.generated_text;
      }
      
      // Extract score from text (look for numbers 0-100)
      const scoreMatch = matchText.match(/\b(\d{1,3})\b/);
      if (scoreMatch) {
        const extractedScore = parseInt(scoreMatch[1]);
        if (extractedScore >= 0 && extractedScore <= 100) {
          matchScore = extractedScore;
        }
      }
      
      // Extract suggestions - look for any text after score
      const suggestionMatch = matchText.match(/\d+\s*(.+)/i);
      if (suggestionMatch && suggestionMatch[1]) {
        improvementSuggestions = suggestionMatch[1].trim();
      }
    }

    // Fallback keywords if API fails
    if (missingKeywords.length === 0) {
      missingKeywords = [
        'JavaScript', 'React', 'Node.js', 'Python', 'SQL',
        'Problem Solving', 'Team Work', 'Communication'
      ];
    }

    // If all APIs failed, provide a helpful message
    if (summaryResult.status === 'rejected' && keywordsResult.status === 'rejected' && matchResult.status === 'rejected') {
      summary = "AI analysis temporarily unavailable. Please check your HuggingFace API key permissions.";
      improvementSuggestions = "To enable AI analysis, ensure your HuggingFace API key has 'Inference API' permissions enabled.";
    }

    res.json({
      success: true,
      data: {
        summary: summary,
        missingKeywords: missingKeywords,
        matchScore: matchScore,
        improvementSuggestions: improvementSuggestions
      }
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

// Get AI analysis status
const getAIStatus = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'AI Analysis service is running',
      models: [
        'facebook/bart-large-cnn (Resume Summary)',
        'google/flan-t5-base (Keywords & Match Score)'
      ],
      apiKey: HUGGINGFACE_API_KEY ? 'Configured' : 'Not configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'AI service unavailable',
      error: error.message
    });
  }
};

module.exports = {
  analyzeResume,
  getAIStatus
};

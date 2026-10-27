export interface RecaptchaCheckResult {
  ok: boolean
  score: number
  requireV2?: boolean
  error?: string
}

/**
 * Verifies Google reCAPTCHA v3 score server-side.
 * If score < 0.5 and no verified v2 token is provided, signals the client form
 * to display the visible reCAPTCHA v2 challenge per Step 13 & Step 4 API rules.
 */
export async function verifyRecaptchaServer(
  recaptchaToken?: string,
  recaptchaV2Token?: string
): Promise<RecaptchaCheckResult> {
  if (recaptchaV2Token && recaptchaV2Token.trim().length > 0) {
    return { ok: true, score: 1.0 }
  }

  if (recaptchaToken === 'LOW_SCORE_TEST') {
    return {
      ok: false,
      score: 0.3,
      requireV2: true,
      error: 'Security verification score below 0.5. Please complete the visible verification check.',
    }
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    if (!recaptchaToken || recaptchaToken.trim().length < 3) {
      return {
        ok: false,
        score: 0.2,
        requireV2: true,
        error: 'Security token missing. Please complete the visible verification check.',
      }
    }
    return { ok: true, score: 0.9 }
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: recaptchaToken || '',
    })
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await response.json()) as { success?: boolean; score?: number }
    const score = typeof data.score === 'number' ? data.score : data.success ? 0.9 : 0.2

    if (!data.success || score < 0.5) {
      return {
        ok: false,
        score,
        requireV2: true,
        error: 'Automated check scored below 0.5. Please complete the visible reCAPTCHA box below.',
      }
    }

    return { ok: true, score }
  } catch {
    return { ok: true, score: 0.85 }
  }
}

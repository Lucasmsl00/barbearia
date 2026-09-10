package br.com.lucaslima.barbearia.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Pattern;

@Service
public class RecaptchaService {

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    private static final Pattern SUCCESS_TRUE = Pattern.compile("\"success\"\\s*:\\s*true");

    private final boolean habilitado;
    private final String secretKey;
    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();

    public RecaptchaService(
            @Value("${recaptcha.enabled:false}") boolean habilitado,
            @Value("${recaptcha.secret-key:}") String secretKey
    ) {
        this.habilitado = habilitado;
        this.secretKey = secretKey;
    }

    public boolean isHabilitado() {
        return habilitado;
    }

    public boolean validar(String token) {
        if (!habilitado) {
            return true;
        }
        if (token == null || token.isBlank() || secretKey.isBlank()) {
            return false;
        }

        try {
            String corpo = "secret=" + secretKey + "&response=" + token;
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(VERIFY_URL))
                    .timeout(Duration.ofSeconds(5))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(corpo))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            return SUCCESS_TRUE.matcher(response.body()).find();
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return false;
        }
    }
}

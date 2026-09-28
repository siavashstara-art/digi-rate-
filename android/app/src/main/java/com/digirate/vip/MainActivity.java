package com.digirate.vip;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private static final String APP_URL = "https://ais-pre-vch3mzc6h24mcwscvgeoqv-453570687245.europe-west2.run.app";

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Expose In-App Billing Bridge for CafeBazaar & Myket Monthly-to-Annual Subscriptions
        webView.addJavascriptInterface(new AndroidBillingBridge(), "AndroidBillingBridge");

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());
        webView.loadUrl(APP_URL);
    }

    public class AndroidBillingBridge {
        @JavascriptInterface
        public void launchMarketSubscription(String marketName, String skuId, String planTitle) {
            runOnUiThread(() -> Toast.makeText(
                MainActivity.this,
                "درگاه پرداخت درون‌برنامه‌ای " + marketName + " (" + skuId + "): " + planTitle,
                Toast.LENGTH_LONG
            ).show());
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}

import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useDeepLinking() {
  const router = useRouter();

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (!url) return;
      console.log("[DeepLink] URL:", url);

      // --- Try PKCE exchange ---
      const { data, error } = await supabase.auth.exchangeCodeForSession({ url });
      if (data?.session && !error) {
        console.log("[DeepLink] Session restored via PKCE");
      } else {
        console.warn("[DeepLink] exchangeCodeForSession failed:", error?.message);

        // --- Fallback: parse fragment tokens ---
        const hashIndex = url.indexOf("#");
        if (hashIndex !== -1) {
          const fragment = url.substring(hashIndex + 1);
          const params = Object.fromEntries(new URLSearchParams(fragment));

          if (params["access_token"] && params["refresh_token"]) {
            const { error: setErr } = await supabase.auth.setSession({
              access_token: params["access_token"],
              refresh_token: params["refresh_token"],
            });
            if (!setErr) {
              console.log("[DeepLink] Session restored from tokens");
            }
          }
        }
      }

      // --- Navigate if it’s a recovery link ---
      const { queryParams } = Linking.parse(url);
      const type =
        queryParams?.type ??
        new URLSearchParams(url.split("#")[1] ?? "").get("type");

      if (type === "recovery") {
        router.push("/reset-password?mode=update");
      }
    };

    // Cold start
    Linking.getInitialURL().then(handleUrl);

    // Foreground links
    const sub = Linking.addEventListener("url", ({ url }) => handleUrl(url));

    return () => sub.remove();
  }, [router]);
}

package com.nhscovid19;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;
import java.io.*;
import androidx.core.content.FileProvider;
import android.content.pm.ApplicationInfo;
import android.net.Uri;


public class ShareAppModule extends ReactContextBaseJavaModule {

    ShareAppModule(ReactApplicationContext context) {
        super(context);
    }


    @Override
    public String getName() {
        return "ShareAppModule";
    }

    @ReactMethod
    private void ShareApp() {
        ApplicationInfo app = getReactApplicationContext().getApplicationInfo();
        String filePath = app.sourceDir;

        Intent intent = new Intent(Intent.ACTION_SEND);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        // MIME of .apk is "application/vnd.android.package-archive".
        // but Bluetooth does not accept this. Let's use "*/*" instead.
        intent.setType("*/*");

        // Append file and send Intent
        File originalApk = new File(filePath);

        try {
            //Make new directory in new location=
            File tempFile = new File(getReactApplicationContext().getExternalCacheDir() + "/ExtractedApk");
            //If directory doesn't exists create new
            if (!tempFile.isDirectory())
                if (!tempFile.mkdirs())
                    return;
            //Get application's name and convert to lowercase
            tempFile = new File(tempFile.getPath() + "/" + getReactApplicationContext().getString(app.labelRes).replace(" ", "").toLowerCase() + ".apk");
            //If file doesn't exists create new
            if (!tempFile.exists()) {
                if (!tempFile.createNewFile()) {
                    return;
                }
            }
            //Copy file to new location
            InputStream in = new FileInputStream(originalApk);
            OutputStream out = new FileOutputStream(tempFile);

            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            in.close();
            out.close();
            System.out.println("File copied.");
            //Open share dialog
//          intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(tempFile));
            Uri photoURI = FileProvider.getUriForFile(getReactApplicationContext().getCurrentActivity(), BuildConfig.APPLICATION_ID + ".fileprovider", tempFile);
//          intent.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(tempFile));
            intent.putExtra(Intent.EXTRA_STREAM, photoURI);

            Intent chooserIntent = Intent.createChooser(intent, "Share app with");
            chooserIntent.addFlags((Intent.FLAG_ACTIVITY_NEW_TASK));

            getReactApplicationContext().startActivity(chooserIntent);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

//    @ReactMethod
//    public void ShareApp() {
//        try {
//            StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
//            StrictMode.setVmPolicy(builder.build());
//            PackageManager pm = getReactApplicationContext().getPackageManager();
//            ApplicationInfo ai = pm.getApplicationInfo(getReactApplicationContext().getPackageName(), 0);
//            File srcFile = new File(ai.publicSourceDir);
//            Intent share = new Intent(Intent.ACTION_VIEW);
//            share.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            share.setAction(Intent.ACTION_SEND);
//            share.setType("application/vnd.android.package-archive");
//            share.putExtra(Intent.EXTRA_STREAM, Uri.fromFile(srcFile));
//            Intent chooserIntent = Intent.createChooser(share, "Share Covid1984 app via");
//            chooserIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//            getReactApplicationContext().startActivity(chooserIntent);
//
//        } catch (Exception e) {
//            Log.e("ShareApp", e.getMessage());
//        }
//    }




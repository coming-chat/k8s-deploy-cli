export const deployfileData = 'kind: Deployment\n' +
  'apiVersion: apps/v1\n' +
  'metadata:\n' +
  '  name: kusama-slot-front\n' +
  '  namespace: chainx-pre\n' +
  '  labels:\n' +
  '    app: kusama-slot-front\n' +
  'spec:\n' +
  '  replicas: 4\n' +
  '  selector:\n' +
  '    matchLabels:\n' +
  '      app: kusama-slot-front\n' +
  '  template:\n' +
  '    metadata:\n' +
  '      creationTimestamp: null\n' +
  '      labels:\n' +
  '        app: kusama-slot-front\n' +
  '    spec:\n' +
  '      imagePullSecrets:\n' +
  '        - name: regcred\n' +
  '      containers:\n' +
  '        - name: container-api-pre\n' +
  '          image: $REGISTRY/$DOCKERHUB_NAMESPACE/$APP_NAME:$BUILD_NUMBER\n' +
  '          command:\n' +
  '            - /bin/sh\n' +
  '            - \'-c\'\n' +
  '            - >-\n' +
  '              cd /usr/share/nginx/html && envsubst < /etc/nginx/nginx.template >\n' +
  '              /etc/nginx/conf.d/default.conf && nginx -g \'daemon off;\'\n' +
  '          ports:\n' +
  '            - name: http-main\n' +
  '              containerPort: 80\n' +
  '              protocol: TCP\n' +
  '          envFrom:\n' +
  '            - configMapRef:\n' +
  '                name: aws-config\n' +
  '          resources: {}\n' +
  '          terminationMessagePath: /dev/termination-log\n' +
  '          terminationMessagePolicy: File\n' +
  '          imagePullPolicy: Always\n' +
  '      restartPolicy: Always\n' +
  '      terminationGracePeriodSeconds: 30\n' +
  '      dnsPolicy: ClusterFirst\n' +
  '      serviceAccountName: default\n' +
  '      serviceAccount: default\n' +
  '      securityContext: {}\n' +
  '      affinity: {}\n' +
  '      schedulerName: default-scheduler\n' +
  '  strategy:\n' +
  '    type: RollingUpdate\n' +
  '    rollingUpdate:\n' +
  '      maxUnavailable: 25%\n' +
  '      maxSurge: 25%\n' +
  '  revisionHistoryLimit: 10\n' +
  '  progressDeadlineSeconds: 600\n'

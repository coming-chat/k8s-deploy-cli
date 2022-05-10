export const deployfileData = 'kind: Deployment\n' +
  'apiVersion: apps/v1\n' +
  'metadata:\n' +
  '  name: APP_NAME\n' +
  '  namespace: NAME_SPACE\n' +
  '  labels:\n' +
  '    app: APP_NAME\n' +
  'spec:\n' +
  '  replicas: 4\n' +
  '  selector:\n' +
  '    matchLabels:\n' +
  '      app: APP_NAME\n' +
  '  template:\n' +
  '    metadata:\n' +
  '      creationTimestamp: null\n' +
  '      labels:\n' +
  '        app: APP_NAME\n' +
  '    spec:\n' +
  '      imagePullSecrets:\n' +
  '        - name: comingweb3-registry-secret\n' +
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
  '          livenessProbe:\n' +
  '            httpGet:\n' +
  '              path: /\n' +
  '              port: 80\n' +
  '              scheme: HTTP\n' +
  '            timeoutSeconds: 1\n' +
  '            periodSeconds: 10\n' +
  '            successThreshold: 1\n' +
  '            failureThreshold: 3\n' +
  '          readinessProbe:\n' +
  '            httpGet:\n' +
  '              path: /\n' +
  '              port: 80\n' +
  '              scheme: HTTP\n' +
  '            timeoutSeconds: 1\n' +
  '            periodSeconds: 10\n' +
  '            successThreshold: 1\n' +
  '            failureThreshold: 3\n' +
  '          startupProbe:\n' +
  '            httpGet:\n' +
  '              path: /\n' +
  '              port: 80\n' +
  '              scheme: HTTP\n' +
  '            initialDelaySeconds: 2\n' +
  '            timeoutSeconds: 1\n' +
  '            periodSeconds: 10\n' +
  '            successThreshold: 1\n' +
  '            failureThreshold: 3' +
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
  '  progressDeadlineSeconds: 600\n' +
  '\n' +
  '---\n' +
  '\n' +
  'apiVersion: v1\n' +
  'kind: Service\n' +
  'metadata:\n' +
  '  name: APP_NAME\n' +
  '  namespace: NAME_SPACE\n' +
  'spec:\n' +
  '  ports:\n' +
  '    - port: 80\n' +
  '      name: http-main\n' +
  '  selector:\n' +
  '    app: APP_NAME\n' +
  '\n' +
  '\n' +
  '---\n' +
  '\n' +
  'kind: Ingress\n' +
  'apiVersion: networking.k8s.io/v1\n' +
  'metadata:\n' +
  '  name: INGRESS_NAME\n' +
  '  namespace: NAME_SPACE\n' +
  '  annotations:\n' +
  '    external-dns.alpha.kubernetes.io/target: a5d156c18cea5820c.awsglobalaccelerator.com\n' +
  '\n' +
  'spec:\n' +
  '  rules:\n' +
  '    - host: DOMAIN_NAME\n' +
  '      http:\n' +
  '        paths:\n' +
  '          - path: /\n' +
  '            pathType: ImplementationSpecific\n' +
  '            backend:\n' +
  '              service:\n' +
  '                name: APP_NAME\n' +
  '                port:\n' +
  '                  number: 80'
